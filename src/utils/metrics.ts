import type { PetState, Stage, ActionId, EventId } from '@/types';

const METRICS_ENABLED = import.meta.env.VITE_METRICS_ENABLED === 'true';
const FLUSH_INTERVAL_MS = 10_000;

let buffer: string[] = [];
let flushTimer: ReturnType<typeof setInterval> | null = null;

function escapeTag(val: string): string {
  return val.replace(/ /g, '\\ ').replace(/,/g, '\\,').replace(/=/g, '\\=');
}

function buildLine(
  measurement: string,
  tags: Record<string, string>,
  fields: Record<string, number | string>
): string {
  const tagStr = Object.entries(tags)
    .map(([k, v]) => `${k}=${escapeTag(v)}`)
    .join(',');
  const fieldStr = Object.entries(fields)
    .map(([k, v]) => (typeof v === 'string' ? `${k}="${v}"` : `${k}=${v}`))
    .join(',');
  return `${measurement},${tagStr} ${fieldStr}`;
}

async function flush() {
  if (buffer.length === 0) return;

  const payload = buffer.join('\n');
  buffer = [];

  try {
    console.log(`[xenogotchi-metrics] flushing ${payload.split('\n').length} line(s)`);

    const resp = await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: payload,
    });

    if (!resp.ok) {
      console.warn(`[xenogotchi-metrics] push failed: ${resp.status} ${resp.statusText}`);
      const body = await resp.text();
      if (body) console.warn(`[xenogotchi-metrics] response: ${body}`);
    } else {
      console.log(`[xenogotchi-metrics] push OK (${resp.status})`);
    }
  } catch (err) {
    console.warn('[xenogotchi-metrics] push error:', err);
  }
}

export function initMetrics() {
  if (!METRICS_ENABLED) {
    console.log('[xenogotchi-metrics] disabled via VITE_METRICS_ENABLED');
    return;
  }
  if (flushTimer) return;
  console.log('[xenogotchi-metrics] initialized — flushing every', FLUSH_INTERVAL_MS, 'ms');
  flushTimer = setInterval(flush, FLUSH_INTERVAL_MS);
  window.addEventListener('beforeunload', flush);
}

export function stopMetrics() {
  if (flushTimer) {
    clearInterval(flushTimer);
    flushTimer = null;
  }
  flush();
}

export function trackStats(pet: PetState) {
  if (!METRICS_ENABLED) return;
  buffer.push(
    buildLine(
      'xenogotchi_stats',
      { stage: pet.stage, generation: String(pet.generation) },
      {
        biomass: pet.biomass,
        aggression: pet.aggression,
        hive_bond: pet.hiveBond,
        acid_potency: pet.acidPotency,
        stealth: pet.stealth,
        alive_seconds: Math.floor((Date.now() - pet.bornAt) / 1000),
      }
    )
  );
}

export function trackAction(stage: Stage, action: ActionId) {
  if (!METRICS_ENABLED) return;
  buffer.push(
    buildLine('xenogotchi_action', { stage, action }, { count: 1 })
  );
}

export function trackEvolution(from: Stage, to: Stage) {
  if (!METRICS_ENABLED) return;
  buffer.push(
    buildLine('xenogotchi_evolution', { from, to }, { count: 1 })
  );
}

export function trackEvent(stage: Stage, eventId: EventId, outcome: 'success' | 'failure') {
  if (!METRICS_ENABLED) return;
  buffer.push(
    buildLine('xenogotchi_event', { stage, event: eventId, outcome }, { count: 1 })
  );
}

export function trackGameOver(pet: PetState, reason: 'death' | 'neomorph' | 'queen_win') {
  if (!METRICS_ENABLED) return;
  buffer.push(
    buildLine(
      'xenogotchi_gameover',
      { stage: pet.stage, reason, generation: String(pet.generation) },
      {
        alive_seconds: Math.floor((Date.now() - pet.bornAt) / 1000),
        evolutions: pet.totalEvolutions,
        actions: pet.actionsPerformed,
      }
    )
  );
  flush();
}
