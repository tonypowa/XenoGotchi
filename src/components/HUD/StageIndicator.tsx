import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/petStore';
import { STAGES } from '@/data/stages';
import { formatDuration } from '@/utils/time';

export function StageIndicator() {
  const pet = useGameStore((s) => s.pet);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Date.now() - pet.bornAt), 1000);
    return () => clearInterval(t);
  }, [pet.bornAt]);

  const stage = STAGES[pet.stage];
  if (!stage) return null;

  return (
    <div className="hud">
      <div className="hud-row">
        <span className="hud-label">Specimen</span>
        <span className="hud-value">{pet.name}</span>
      </div>
      <div className="hud-row">
        <span className="hud-label">Stage</span>
        <span className="hud-value">{stage.emoji} {stage.name}</span>
      </div>
      <div className="hud-row">
        <span className="hud-label">Alive</span>
        <span className="hud-value">{formatDuration(elapsed)}</span>
      </div>
      <div className="hud-row">
        <span className="hud-label">Generation</span>
        <span className="hud-value">#{pet.generation}</span>
      </div>
      <div className="hud-row">
        <span className="hud-label">Evolutions</span>
        <span className="hud-value">{pet.totalEvolutions}</span>
      </div>
      {pet.hostType && (
        <div className="hud-row">
          <span className="hud-label">Host DNA</span>
          <span className="hud-value">{pet.hostType}</span>
        </div>
      )}
      {pet.yautjaDna && (
        <div className="hud-row">
          <span className="hud-label">Yautja DNA</span>
          <span className="hud-value yautja">ACQUIRED</span>
        </div>
      )}
    </div>
  );
}
