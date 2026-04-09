import type { PetState, StatKey } from '@/types';
import { STAGES } from '@/data/stages';

const STAT_KEYS: StatKey[] = ['biomass', 'aggression', 'hiveBond', 'acidPotency', 'stealth'];

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));

export function applyDecay(pet: PetState, elapsedMs: number): Partial<PetState> {
  const stage = STAGES[pet.stage];
  if (!stage) return {};

  const elapsedMinutes = elapsedMs / 60_000;
  const updates: Partial<PetState> = {};

  for (const key of STAT_KEYS) {
    const rate = stage.decayRates[key];
    if (rate <= 0) continue;

    const bonus = pet.statBonuses[key] ?? 0;
    const effectiveRate = Math.max(0, rate - bonus * 0.1);
    const newVal = clamp(pet[key] - effectiveRate * elapsedMinutes);
    (updates as any)[key] = newVal;
  }

  return updates;
}

export function applyStatChange(
  pet: PetState,
  changes: Partial<Record<StatKey, number>>
): Partial<PetState> {
  const updates: Partial<PetState> = {};

  for (const key of STAT_KEYS) {
    const delta = changes[key];
    if (delta === undefined) continue;
    (updates as any)[key] = clamp(pet[key] + delta);
  }

  return updates;
}

export function isStatCritical(pet: PetState): boolean {
  return STAT_KEYS.some((k) => pet[k] <= 0);
}

export function getLowestStat(pet: PetState): { key: StatKey; value: number } {
  let lowest: StatKey = 'biomass';
  let lowestVal = pet.biomass;

  for (const key of STAT_KEYS) {
    if (pet[key] < lowestVal) {
      lowest = key;
      lowestVal = pet[key];
    }
  }

  return { key: lowest, value: lowestVal };
}

export { STAT_KEYS, clamp };
