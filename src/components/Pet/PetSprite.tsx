import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/petStore';
import { STAGES } from '@/data/stages';

export function PetSprite() {
  const pet = useGameStore((s) => s.pet);
  const stage = STAGES[pet.stage];
  const [frame, setFrame] = useState(0);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const speed = pet.stage === 'facehugger' ? 300 : pet.stage === 'chestburster' ? 500 : 800;
    const timer = setInterval(() => setFrame((f) => (f + 1) % 3), speed);
    return () => clearInterval(timer);
  }, [pet.stage]);

  useEffect(() => {
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 600);
    return () => clearTimeout(t);
  }, [pet.stage]);

  if (!stage) return null;

  const offsetY = frame === 1 ? -2 : frame === 2 ? 2 : 0;
  const scale = frame === 1 ? 1.02 : 1;
  const opacity = pet.stage === 'lurker' ? 0.7 : 1;

  return (
    <div className="pet-sprite-container">
      <div
        className={`pet-sprite ${flash ? 'evolution-flash' : ''}`}
        style={{
          transform: `translateY(${offsetY}px) scale(${scale})`,
          opacity,
          transition: 'transform 0.3s ease, opacity 0.5s ease',
        }}
      >
        <pre className="pet-ascii">
          {stage.ascii.join('\n')}
        </pre>
      </div>
      <div className="pet-name">{stage.emoji} {stage.name}</div>
      {pet.stage === 'ovomorph' && !pet.hostLured && (
        <div className="pet-hint pulse">Click the egg to lure a host...</div>
      )}
      {pet.stage === 'neomorph' && (
        <div className="pet-hint danger">SPECIMEN LOST — Gone feral</div>
      )}
      {pet.stage === 'queen' && (
        <div className="pet-hint queen">The hive is complete. Long live the Queen.</div>
      )}
    </div>
  );
}
