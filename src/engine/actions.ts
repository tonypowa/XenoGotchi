import type { ActionId, PetState, Stage } from '@/types';
import { ACTIONS_MAP } from '@/data/actions';

const STAGE_ORDER: Stage[] = [
  'ovomorph', 'facehugger', 'chestburster',
  'drone', 'warrior', 'lurker', 'runner',
  'praetorian', 'queen', 'neomorph', 'predalien',
];

function stageAtLeast(current: Stage, min: Stage): boolean {
  return STAGE_ORDER.indexOf(current) >= STAGE_ORDER.indexOf(min);
}

export function canPerformAction(pet: PetState, actionId: ActionId): {
  allowed: boolean;
  reason?: string;
} {
  const action = ACTIONS_MAP[actionId];
  if (!action) return { allowed: false, reason: 'Unknown action' };

  if (!pet.isAlive) return { allowed: false, reason: 'Specimen is dead' };
  if (pet.stage === 'neomorph') return { allowed: false, reason: 'Neomorph is uncontrollable' };

  if (!stageAtLeast(pet.stage, action.minStage)) {
    return { allowed: false, reason: `Requires ${action.minStage} stage or later` };
  }

  const cooldownEnd = pet.cooldowns[actionId] ?? 0;
  if (Date.now() < cooldownEnd) {
    const remaining = Math.ceil((cooldownEnd - Date.now()) / 1000);
    return { allowed: false, reason: `Cooldown: ${remaining}s` };
  }

  return { allowed: true };
}

export function getAvailableActions(pet: PetState): ActionId[] {
  const stageDef = STAGE_ORDER.indexOf(pet.stage);
  if (stageDef < 0) return [];

  return Object.keys(ACTIONS_MAP).filter((id) => {
    const { allowed } = canPerformAction(pet, id as ActionId);
    return allowed;
  }) as ActionId[];
}

export function getCooldownRemaining(pet: PetState, actionId: ActionId): number {
  const end = pet.cooldowns[actionId] ?? 0;
  return Math.max(0, end - Date.now());
}
