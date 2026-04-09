import type { GameEvent, PetState, Stage } from '@/types';
import { EVENTS } from '@/data/events';

const STAGE_ORDER: Stage[] = [
  'ovomorph', 'facehugger', 'chestburster',
  'drone', 'warrior', 'lurker', 'runner',
  'praetorian', 'queen', 'neomorph', 'predalien',
];

function stageAtLeast(current: Stage, min: Stage): boolean {
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf(min);
}

export function getEligibleEvents(pet: PetState): GameEvent[] {
  return EVENTS.filter((e) => stageAtLeast(pet.stage, e.minStage));
}

export function rollForEvent(pet: PetState): GameEvent | null {
  const eligible = getEligibleEvents(pet);
  if (eligible.length === 0) return null;

  const totalWeight = eligible.reduce((sum, e) => sum + e.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const event of eligible) {
    roll -= event.weight;
    if (roll <= 0) return event;
  }

  return eligible[eligible.length - 1];
}

export function resolveChoice(
  pet: PetState,
  event: GameEvent,
  choiceIndex: number
): { statChanges: Partial<Record<string, number>>; text: string; special?: string } {
  const choice = event.choices[choiceIndex];
  if (!choice) {
    return { statChanges: {}, text: 'Nothing happens.' };
  }

  if (choice.statCheck) {
    const statVal = pet[choice.statCheck.stat];
    const succeeded = statVal >= choice.statCheck.threshold;

    return {
      statChanges: succeeded ? choice.success : choice.failure,
      text: succeeded ? choice.successText : choice.failureText,
      special: succeeded ? choice.special : undefined,
    };
  }

  return {
    statChanges: choice.success,
    text: choice.successText,
    special: choice.special,
  };
}

const MIN_EVENT_INTERVAL_MS = 45_000;
const MAX_EVENT_INTERVAL_MS = 120_000;

export function nextEventDelay(): number {
  return MIN_EVENT_INTERVAL_MS + Math.random() * (MAX_EVENT_INTERVAL_MS - MIN_EVENT_INTERVAL_MS);
}
