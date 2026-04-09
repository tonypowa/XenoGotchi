import { useGameStore } from '@/stores/petStore';
import type { StatKey } from '@/types';

const STAT_CONFIG: { key: StatKey; label: string; icon: string; color: string }[] = [
  { key: 'biomass', label: 'Biomass', icon: '🍖', color: '#e74c3c' },
  { key: 'aggression', label: 'Aggression', icon: '🔥', color: '#e67e22' },
  { key: 'hiveBond', label: 'Hive Bond', icon: '🏠', color: '#9b59b6' },
  { key: 'acidPotency', label: 'Acid Potency', icon: '🧪', color: '#2ecc71' },
  { key: 'stealth', label: 'Stealth', icon: '👁️', color: '#3498db' },
];

function StatRow({ config, value }: { config: typeof STAT_CONFIG[number]; value: number }) {
  const pct = Math.max(0, Math.min(100, value));
  const isLow = pct < 25;
  const isCritical = pct < 10;

  return (
    <div className={`stat-row ${isLow ? 'stat-low' : ''} ${isCritical ? 'stat-critical' : ''}`}>
      <span className="stat-icon">{config.icon}</span>
      <span className="stat-label">{config.label}</span>
      <div className="stat-bar-bg">
        <div
          className="stat-bar-fill"
          style={{
            width: `${pct}%`,
            backgroundColor: config.color,
          }}
        />
      </div>
      <span className="stat-value">{Math.round(pct)}</span>
    </div>
  );
}

export function StatsBar() {
  const pet = useGameStore((s) => s.pet);

  return (
    <div className="stats-panel">
      {STAT_CONFIG.map((c) => (
        <StatRow key={c.key} config={c} value={pet[c.key]} />
      ))}
    </div>
  );
}
