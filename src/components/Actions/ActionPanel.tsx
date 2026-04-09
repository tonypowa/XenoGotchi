import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/petStore';
import { ACTIONS } from '@/data/actions';
import { STAGES } from '@/data/stages';
import { canPerformAction, getCooldownRemaining } from '@/engine/actions';
import { formatCooldown } from '@/utils/time';
import type { ActionId, HostType } from '@/types';

export function ActionPanel() {
  const pet = useGameStore((s) => s.pet);
  const performAction = useGameStore((s) => s.performAction);
  const lureHost = useGameStore((s) => s.lureHost);
  const selectHost = useGameStore((s) => s.selectHost);
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const t = setInterval(() => forceUpdate((n) => n + 1), 500);
    return () => clearInterval(t);
  }, []);

  if (!pet.isAlive && pet.stage !== 'queen') return null;

  if (pet.stage === 'ovomorph' && !pet.hostLured) {
    return (
      <div className="action-panel">
        <button className="action-btn egg-btn" onClick={lureHost}>
          🥚 Lure Host
        </button>
      </div>
    );
  }

  if (pet.stage === 'facehugger' && !pet.hostAttached) {
    const hosts: { type: HostType; label: string; icon: string }[] = [
      { type: 'human', label: 'Human Crew', icon: '👤' },
      { type: 'animal', label: 'Station Dog', icon: '🐕' },
      { type: 'engineer', label: 'Engineer', icon: '🗿' },
    ];

    return (
      <div className="action-panel">
        <div className="host-selection">
          <div className="host-title">Select Host:</div>
          {hosts.map((h) => (
            <button
              key={h.type}
              className="action-btn host-btn"
              onClick={() => selectHost(h.type)}
            >
              {h.icon} {h.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const stageDef = STAGES[pet.stage];
  if (!stageDef) return null;

  const available = ACTIONS.filter((a) => stageDef.availableActions.includes(a.id));

  return (
    <div className="action-panel">
      {available.map((action) => {
        const { allowed, reason } = canPerformAction(pet, action.id);
        const cooldown = getCooldownRemaining(pet, action.id);
        const onCooldown = cooldown > 0;

        return (
          <button
            key={action.id}
            className={`action-btn ${onCooldown ? 'on-cooldown' : ''} ${!allowed ? 'disabled' : ''}`}
            onClick={() => allowed && performAction(action.id as ActionId)}
            disabled={!allowed}
            title={reason ?? action.description}
          >
            <span className="action-icon">{action.icon}</span>
            <span className="action-name">{action.name}</span>
            {onCooldown && <span className="action-cooldown">{formatCooldown(cooldown)}</span>}
          </button>
        );
      })}
    </div>
  );
}
