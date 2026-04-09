import type { EvolutionRule, PetState, Stage } from '@/types';
import { STAGES } from '@/data/stages';

const stageIndex = (s: Stage) => {
  const order: Stage[] = [
    'ovomorph', 'facehugger', 'chestburster',
    'drone', 'warrior', 'lurker', 'runner',
    'praetorian', 'queen', 'neomorph', 'predalien',
  ];
  return order.indexOf(s);
};

const isAtLeast = (current: Stage, min: Stage) => stageIndex(current) >= stageIndex(min);

function avgStat(p: PetState): number {
  return (p.biomass + p.aggression + p.hiveBond + p.acidPotency + p.stealth) / 5;
}

function minutesInStage(p: PetState): number {
  return (Date.now() - p.stageEnteredAt) / 60_000;
}

export const EVOLUTION_RULES: EvolutionRule[] = [
  {
    from: 'ovomorph',
    to: 'facehugger',
    priority: 1,
    description: 'Egg opens when host is lured nearby',
    condition: (p) => p.hostLured,
  },
  {
    from: 'facehugger',
    to: 'chestburster',
    priority: 1,
    description: 'Facehugger attaches and implants embryo',
    condition: (p) => p.hostAttached && p.incubationComplete,
  },
  {
    from: 'chestburster',
    to: 'neomorph',
    priority: 0,
    description: 'Neglect causes feral mutation',
    condition: (p) => avgStat(p) < 15 && minutesInStage(p) > 3,
  },
  {
    from: 'chestburster',
    to: 'predalien',
    priority: 10,
    description: 'Yautja DNA triggers hybrid evolution',
    condition: (p) => p.yautjaDna && p.biomass > 50,
  },
  {
    from: 'chestburster',
    to: 'runner',
    priority: 5,
    description: 'Animal host produces quadrupedal form',
    condition: (p) => p.hostType === 'animal' && p.biomass > 60 && minutesInStage(p) > 2,
  },
  {
    from: 'chestburster',
    to: 'warrior',
    priority: 3,
    description: 'High aggression breeds a warrior',
    condition: (p) => p.biomass > 65 && p.aggression > 70 && minutesInStage(p) > 2,
  },
  {
    from: 'chestburster',
    to: 'drone',
    priority: 2,
    description: 'High hive bond produces a worker drone',
    condition: (p) => p.biomass > 65 && p.hiveBond > 65 && minutesInStage(p) > 2,
  },
  {
    from: 'chestburster',
    to: 'lurker',
    priority: 4,
    description: 'Stealth-focused growth breeds a lurker',
    condition: (p) => p.stealth > 70 && p.aggression > 40 && minutesInStage(p) > 2,
  },
  {
    from: 'drone',
    to: 'praetorian',
    priority: 1,
    description: 'Devoted drone ascends to royal guard',
    condition: (p) => p.hiveBond > 80 && p.biomass > 70 && minutesInStage(p) > 10,
  },
  {
    from: 'warrior',
    to: 'praetorian',
    priority: 1,
    description: 'Dominant warrior earns praetorian status',
    condition: (p) => p.aggression > 80 && p.biomass > 70 && minutesInStage(p) > 10,
  },
  {
    from: 'praetorian',
    to: 'queen',
    priority: 1,
    description: 'Royal Jelly consumed — the Queen rises',
    condition: (p) => p.hiveBond > 85 && p.biomass > 80 && minutesInStage(p) > 5,
  },
];

export function checkEvolution(pet: PetState): Stage | null {
  const applicable = EVOLUTION_RULES
    .filter((r) => r.from === pet.stage && r.condition(pet))
    .sort((a, b) => b.priority - a.priority);

  return applicable.length > 0 ? applicable[0].to : null;
}

export function getStageDefinition(stage: Stage) {
  return STAGES[stage];
}

export { isAtLeast, avgStat, minutesInStage };
