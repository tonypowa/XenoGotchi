import type { ActionDefinition } from '@/types';

export const ACTIONS: ActionDefinition[] = [
  {
    id: 'feed',
    name: 'Feed',
    icon: '🍖',
    description: 'Provide organic matter to sustain the organism.',
    cooldownMs: 30_000,
    effects: { biomass: 20, aggression: 5 },
    minStage: 'facehugger',
  },
  {
    id: 'hunt',
    name: 'Hunt',
    icon: '🎯',
    description: 'Stalk and capture prey in the corridors.',
    cooldownMs: 60_000,
    effects: { biomass: 15, aggression: 15, stealth: 10 },
    minStage: 'chestburster',
  },
  {
    id: 'buildHive',
    name: 'Build Hive',
    icon: '🏗️',
    description: 'Secrete resin to expand the hive structure.',
    cooldownMs: 45_000,
    effects: { hiveBond: 20, acidPotency: 5 },
    minStage: 'drone',
  },
  {
    id: 'stalk',
    name: 'Stalk',
    icon: '👁️',
    description: 'Move through the shadows, perfecting stealth.',
    cooldownMs: 45_000,
    effects: { stealth: 20, aggression: 5 },
    minStage: 'chestburster',
  },
  {
    id: 'molt',
    name: 'Molt',
    icon: '🔄',
    description: 'Shed the exoskeleton. Triggers evolution check.',
    cooldownMs: 300_000,
    effects: { acidPotency: 10 },
    minStage: 'chestburster',
  },
  {
    id: 'rest',
    name: 'Rest',
    icon: '🥀',
    description: 'Enter a dormant cocoon state to recover.',
    cooldownMs: 180_000,
    effects: { biomass: 5, aggression: 5, hiveBond: 5, acidPotency: 5, stealth: 5 },
    minStage: 'ovomorph',
  },
  {
    id: 'layEggs',
    name: 'Lay Eggs',
    icon: '🥚',
    description: 'Begin a new cycle. The hive persists.',
    cooldownMs: 0,
    effects: {},
    minStage: 'queen',
  },
];

export const ACTIONS_MAP = Object.fromEntries(ACTIONS.map((a) => [a.id, a]));
