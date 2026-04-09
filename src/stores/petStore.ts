import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ActionId, ActiveEvent, HostType, PetState, Stage, StatKey } from '@/types';
import { ACTIONS_MAP } from '@/data/actions';
import { applyDecay, applyStatChange, isStatCritical, STAT_KEYS } from '@/engine/statDecay';
import { checkEvolution } from '@/engine/lifecycle';
import { rollForEvent, resolveChoice, nextEventDelay } from '@/engine/eventEngine';
import { canPerformAction } from '@/engine/actions';
import { trackStats, trackAction, trackEvolution, trackEvent, trackGameOver } from '@/utils/metrics';

function createFreshPet(generation = 1, bonuses: Partial<Record<StatKey, number>> = {}): PetState {
  const now = Date.now();
  return {
    name: generation === 1 ? 'Specimen XX-121' : `Specimen XX-${121 + generation - 1}`,
    stage: 'ovomorph',
    biomass: 80,
    aggression: 50,
    hiveBond: 50,
    acidPotency: 60,
    stealth: 50,
    hostType: null,
    hostLured: false,
    hostAttached: false,
    incubationComplete: false,
    bornAt: now,
    stageEnteredAt: now,
    lastTickAt: now,
    totalEvolutions: 0,
    actionsPerformed: 0,
    eventsCompleted: 0,
    isAlive: true,
    isDead: false,
    hasWon: false,
    generation,
    statBonuses: bonuses,
    yautjaDna: false,
    cooldowns: {},
  };
}

interface GameStore {
  pet: PetState;
  gameStarted: boolean;
  activeEvent: ActiveEvent | null;
  eventResultText: string | null;
  nextEventAt: number;
  tickInterval: ReturnType<typeof setInterval> | null;
  lastMetricsAt: number;
  log: string[];

  startGame: () => void;
  resetGame: () => void;
  newGamePlus: () => void;
  tick: () => void;
  performAction: (actionId: ActionId) => void;
  lureHost: () => void;
  selectHost: (type: HostType) => void;
  handleEventChoice: (choiceIndex: number) => void;
  dismissEvent: () => void;
  addLog: (msg: string) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      pet: createFreshPet(),
      gameStarted: false,
      activeEvent: null,
      eventResultText: null,
      nextEventAt: Date.now() + nextEventDelay(),
      tickInterval: null,
      lastMetricsAt: 0,
      log: [],

      addLog: (msg: string) => {
        set((s) => ({ log: [`[${new Date().toLocaleTimeString()}] ${msg}`, ...s.log].slice(0, 50) }));
      },

      startGame: () => {
        const s = get();
        if (s.tickInterval) clearInterval(s.tickInterval);
        const interval = setInterval(() => get().tick(), 1000);
        set({ gameStarted: true, tickInterval: interval });
      },

      resetGame: () => {
        const s = get();
        if (s.tickInterval) clearInterval(s.tickInterval);
        set({
          pet: createFreshPet(),
          gameStarted: false,
          activeEvent: null,
          eventResultText: null,
          nextEventAt: Date.now() + nextEventDelay(),
          tickInterval: null,
          lastMetricsAt: 0,
          log: [],
        });
      },

      newGamePlus: () => {
        const s = get();
        if (s.tickInterval) clearInterval(s.tickInterval);
        const gen = s.pet.generation + 1;
        const bonuses: Partial<Record<StatKey, number>> = {};
        for (const k of STAT_KEYS) {
          bonuses[k] = (s.pet.statBonuses[k] ?? 0) + 1;
        }
        set({
          pet: createFreshPet(gen, bonuses),
          gameStarted: false,
          activeEvent: null,
          eventResultText: null,
          nextEventAt: Date.now() + nextEventDelay(),
          tickInterval: null,
          log: [`--- New Game+ (Generation ${gen}) ---`],
        });
      },

      tick: () => {
        const s = get();
        if (!s.pet.isAlive || s.pet.isDead) return;

        const now = Date.now();
        const elapsed = now - s.pet.lastTickAt;
        const cappedElapsed = Math.min(elapsed, 300_000);

        const decayUpdates = applyDecay(s.pet, cappedElapsed);
        let updatedPet: PetState = { ...s.pet, ...decayUpdates, lastTickAt: now };

        if (isStatCritical(updatedPet)) {
          updatedPet.isAlive = false;
          updatedPet.isDead = true;
          trackGameOver(updatedPet, 'death');
          get().addLog('All vital signs lost. No signal detected.');
          set({ pet: updatedPet });
          return;
        }

        const nextStage = checkEvolution(updatedPet);
        if (nextStage) {
          const prevStage = updatedPet.stage;
          trackEvolution(prevStage, nextStage);
          updatedPet.stage = nextStage;
          updatedPet.stageEnteredAt = now;
          updatedPet.totalEvolutions += 1;
          get().addLog(`Evolution: ${prevStage} → ${nextStage}!`);

          if (nextStage === 'neomorph') {
            updatedPet.isAlive = false;
            trackGameOver(updatedPet, 'neomorph');
            get().addLog('Specimen has gone feral. Containment lost.');
          }
          if (nextStage === 'queen') {
            updatedPet.hasWon = true;
            trackGameOver(updatedPet, 'queen_win');
            get().addLog('The Queen has risen. The hive is complete.');
          }
        }

        if (!s.activeEvent && now >= s.nextEventAt && updatedPet.isAlive) {
          const event = rollForEvent(updatedPet);
          if (event) {
            set({
              activeEvent: { event, triggeredAt: now },
              nextEventAt: now + nextEventDelay(),
            });
            get().addLog(`Event: ${event.name}`);
          }
        }

        const metricsDue = now - s.lastMetricsAt >= 10_000;
        if (metricsDue) {
          trackStats(updatedPet);
        }

        set({
          pet: updatedPet,
          ...(metricsDue ? { lastMetricsAt: now } : {}),
        });
      },

      performAction: (actionId: ActionId) => {
        const s = get();
        const { allowed, reason } = canPerformAction(s.pet, actionId);
        if (!allowed) {
          get().addLog(`Cannot ${actionId}: ${reason}`);
          return;
        }

        const action = ACTIONS_MAP[actionId];
        if (!action) return;

        if (actionId === 'layEggs') {
          get().newGamePlus();
          return;
        }

        const statChanges = applyStatChange(s.pet, action.effects);
        const now = Date.now();

        trackAction(s.pet.stage, actionId);

        set({
          pet: {
            ...s.pet,
            ...statChanges,
            actionsPerformed: s.pet.actionsPerformed + 1,
            cooldowns: {
              ...s.pet.cooldowns,
              [actionId]: now + action.cooldownMs,
            },
          },
        });

        get().addLog(`${action.icon} ${action.name}`);

        if (actionId === 'molt') {
          setTimeout(() => {
            const current = get();
            const nextStage = checkEvolution(current.pet);
            if (nextStage) {
              const prev = current.pet.stage;
              trackEvolution(prev, nextStage);
              set({
                pet: {
                  ...current.pet,
                  stage: nextStage,
                  stageEnteredAt: Date.now(),
                  totalEvolutions: current.pet.totalEvolutions + 1,
                },
              });
              get().addLog(`Molt triggered evolution: ${prev} → ${nextStage}!`);
            } else {
              get().addLog('The molt reveals no change... yet.');
            }
          }, 1500);
        }
      },

      lureHost: () => {
        const s = get();
        if (s.pet.stage !== 'ovomorph') return;
        set({ pet: { ...s.pet, hostLured: true } });
        get().addLog('A host approaches the egg...');
      },

      selectHost: (type: HostType) => {
        const s = get();
        if (s.pet.stage !== 'facehugger') return;
        set({
          pet: {
            ...s.pet,
            hostType: type,
            hostAttached: true,
          },
        });
        get().addLog(`Facehugger attaches to ${type} host!`);

        setTimeout(() => {
          const current = get();
          if (current.pet.stage === 'facehugger' && current.pet.hostAttached) {
            set({ pet: { ...current.pet, incubationComplete: true } });
            get().addLog('Incubation complete. Something is about to happen...');
          }
        }, 5000);
      },

      handleEventChoice: (choiceIndex: number) => {
        const s = get();
        if (!s.activeEvent) return;

        const result = resolveChoice(s.pet, s.activeEvent.event, choiceIndex);
        const statChanges = applyStatChange(s.pet, result.statChanges as Partial<Record<StatKey, number>>);

        let updatedPet = { ...s.pet, ...statChanges, eventsCompleted: s.pet.eventsCompleted + 1 };

        if (result.special === 'grant_yautja_dna') {
          updatedPet.yautjaDna = true;
          get().addLog('Yautja DNA acquired!');
        }

        const outcome = result.text === (s.activeEvent.event.choices[choiceIndex]?.failureText)
          ? 'failure' as const
          : 'success' as const;
        trackEvent(s.pet.stage, s.activeEvent.event.id, outcome);

        set({
          pet: updatedPet,
          eventResultText: result.text,
        });

        get().addLog(result.text);
      },

      dismissEvent: () => {
        set({ activeEvent: null, eventResultText: null });
      },
    }),
    {
      name: 'xenogotchi-save',
      partialize: (state) => ({
        pet: state.pet,
        gameStarted: state.gameStarted,
        log: state.log,
        nextEventAt: state.nextEventAt,
      }),
    }
  )
);
