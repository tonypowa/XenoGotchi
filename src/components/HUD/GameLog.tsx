import { useGameStore } from '@/stores/petStore';

export function GameLog() {
  const log = useGameStore((s) => s.log);

  return (
    <div className="game-log">
      <div className="log-header">SHIP LOG</div>
      <div className="log-entries">
        {log.map((entry, i) => (
          <div key={i} className={`log-entry ${i === 0 ? 'log-latest' : ''}`}>
            {entry}
          </div>
        ))}
        {log.length === 0 && (
          <div className="log-entry log-empty">No transmissions received...</div>
        )}
      </div>
    </div>
  );
}
