import type { Achievement } from '@/types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_hatch',
    name: 'Face Full of Alien',
    description: 'Hatch your first Facehugger.',
    icon: '🕷️',
    condition: (pet) => pet.stage !== 'ovomorph',
  },
  {
    id: 'first_burst',
    name: 'Hello World',
    description: 'Survive the Chestburster stage.',
    icon: '🐛',
    condition: (pet) =>
      !['ovomorph', 'facehugger', 'chestburster'].includes(pet.stage),
  },
  {
    id: 'reach_queen',
    name: 'Long Live the Queen',
    description: 'Evolve to Queen.',
    icon: '♛',
    condition: (pet) => pet.stage === 'queen',
  },
  {
    id: 'reach_predalien',
    name: 'Abomination',
    description: 'Create a Predalien hybrid.',
    icon: '⚔️',
    condition: (pet) => pet.stage === 'predalien',
  },
  {
    id: 'neomorph',
    name: 'Gone Feral',
    description: 'Devolve into a Neomorph through neglect.',
    icon: '💀',
    condition: (pet) => pet.stage === 'neomorph',
  },
  {
    id: 'speed_queen',
    name: 'Speed Run',
    description: 'Reach Queen in under 30 minutes.',
    icon: '⚡',
    condition: (pet) =>
      pet.stage === 'queen' && Date.now() - pet.bornAt < 30 * 60 * 1000,
  },
  {
    id: 'survivor',
    name: 'Perfect Organism',
    description: 'Keep your Xenomorph alive for over 2 hours.',
    icon: '🏆',
    condition: (pet) =>
      pet.isAlive && Date.now() - pet.bornAt > 2 * 60 * 60 * 1000,
  },
  {
    id: 'new_game_plus',
    name: 'The Hive Persists',
    description: 'Start a New Game+ cycle.',
    icon: '♻️',
    condition: (pet) => pet.generation > 1,
  },
  {
    id: 'all_adult_forms',
    name: 'Biodiversity',
    description: 'Reach all four adult forms across different games.',
    icon: '🧬',
    condition: (_pet, meta) => {
      const adults = ['drone', 'warrior', 'lurker', 'runner'];
      return adults.every((s) => meta.stagesReached.includes(s as any));
    },
  },
  {
    id: 'hundred_actions',
    name: 'Busy Hive',
    description: 'Perform 100 actions in a single game.',
    icon: '💪',
    condition: (pet) => pet.actionsPerformed >= 100,
  },
];
