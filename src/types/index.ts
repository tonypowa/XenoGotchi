export type Stage =
  | 'ovomorph'
  | 'facehugger'
  | 'chestburster'
  | 'drone'
  | 'warrior'
  | 'lurker'
  | 'runner'
  | 'praetorian'
  | 'queen'
  | 'neomorph'
  | 'predalien';

export type HostType = 'human' | 'animal' | 'engineer';

export type StatKey = 'biomass' | 'aggression' | 'hiveBond' | 'acidPotency' | 'stealth';

export type ActionId = 'feed' | 'hunt' | 'buildHive' | 'stalk' | 'molt' | 'rest' | 'layEggs';

export type EventId =
  | 'marines_raid'
  | 'power_outage'
  | 'host_opportunity'
  | 'rival_xenomorph'
  | 'weyland_capture'
  | 'royal_jelly'
  | 'yautja_encounter';

export interface StageDefinition {
  id: Stage;
  name: string;
  description: string;
  emoji: string;
  ascii: string[];
  durationMinutes: [number, number];
  decayRates: Record<StatKey, number>;
  availableActions: ActionId[];
  environment: Environment;
}

export type Environment = 'derelict' | 'medbay' | 'vents' | 'hive' | 'throne';

export interface ActionDefinition {
  id: ActionId;
  name: string;
  icon: string;
  description: string;
  cooldownMs: number;
  effects: Partial<Record<StatKey, number>>;
  minStage: Stage;
}

export interface GameEvent {
  id: EventId;
  name: string;
  description: string;
  choices: EventChoice[];
  minStage: Stage;
  weight: number;
}

export interface EventChoice {
  label: string;
  statCheck?: { stat: StatKey; threshold: number };
  success: Partial<Record<StatKey, number>>;
  failure: Partial<Record<StatKey, number>>;
  successText: string;
  failureText: string;
  special?: string;
}

export interface EvolutionRule {
  from: Stage;
  to: Stage;
  condition: (pet: PetState) => boolean;
  priority: number;
  description: string;
}

export interface PetState {
  name: string;
  stage: Stage;
  biomass: number;
  aggression: number;
  hiveBond: number;
  acidPotency: number;
  stealth: number;
  hostType: HostType | null;
  hostLured: boolean;
  hostAttached: boolean;
  incubationComplete: boolean;
  bornAt: number;
  stageEnteredAt: number;
  lastTickAt: number;
  totalEvolutions: number;
  actionsPerformed: number;
  eventsCompleted: number;
  isAlive: boolean;
  isDead: boolean;
  hasWon: boolean;
  generation: number;
  statBonuses: Partial<Record<StatKey, number>>;
  yautjaDna: boolean;
  cooldowns: Partial<Record<ActionId, number>>;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (pet: PetState, meta: AchievementMeta) => boolean;
}

export interface AchievementMeta {
  totalGames: number;
  stagesReached: Stage[];
  fastestQueen: number | null;
  longestSurvival: number;
}

export interface ActiveEvent {
  event: GameEvent;
  triggeredAt: number;
}
