import { useGameStore } from '@/stores/petStore';
import { useSettingsStore } from '@/stores/settingsStore';
import { STAGES } from '@/data/stages';
import type { Environment } from '@/types';

const ENV_CONFIGS: Record<Environment, { className: string; label: string }> = {
  derelict: { className: 'env-derelict', label: 'Derelict Ship — Deck 4' },
  medbay: { className: 'env-medbay', label: 'Medical Bay — Quarantine Zone' },
  vents: { className: 'env-vents', label: 'Ventilation Shaft — Sublevel 2' },
  hive: { className: 'env-hive', label: 'Hive Chamber — Deep Core' },
  throne: { className: 'env-throne', label: 'Queen\'s Chamber — Hive Nexus' },
};

export function Background({ children }: { children: React.ReactNode }) {
  const pet = useGameStore((s) => s.pet);
  const crtFilter = useSettingsStore((s) => s.crtFilter);
  const stage = STAGES[pet.stage];
  const env = stage ? ENV_CONFIGS[stage.environment] : ENV_CONFIGS.derelict;

  return (
    <div className={`game-environment ${env.className} ${crtFilter ? 'crt-on' : ''}`}>
      <div className="env-label">{env.label}</div>
      <div className="scanlines" />
      <div className="env-particles" />
      {children}
    </div>
  );
}
