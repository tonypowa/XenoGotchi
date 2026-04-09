import { useGameStore } from '@/stores/petStore';
import { STAGES } from '@/data/stages';
import { formatDuration } from '@/utils/time';

export function GameOver() {
  const pet = useGameStore((s) => s.pet);
  const resetGame = useGameStore((s) => s.resetGame);
  const newGamePlus = useGameStore((s) => s.newGamePlus);
  const startGame = useGameStore((s) => s.startGame);

  const stage = STAGES[pet.stage];
  const alive = Date.now() - pet.bornAt;
  const isWin = pet.hasWon;

  return (
    <div className="game-over-overlay">
      <div className="game-over-modal">
        {isWin ? (
          <>
            <h1 className="go-title go-win">♛ THE QUEEN HAS RISEN ♛</h1>
            <p className="go-subtitle">The hive is complete. A new cycle begins.</p>
          </>
        ) : pet.stage === 'neomorph' ? (
          <>
            <h1 className="go-title go-feral">SPECIMEN LOST</h1>
            <p className="go-subtitle">Feral mutation detected. Containment failed.</p>
          </>
        ) : (
          <>
            <h1 className="go-title go-dead">NO SIGNAL DETECTED</h1>
            <p className="go-subtitle">The specimen has expired.</p>
          </>
        )}

        <div className="go-stats">
          <div className="go-stat">
            <span>Final Stage</span>
            <span>{stage?.emoji} {stage?.name}</span>
          </div>
          <div className="go-stat">
            <span>Survived</span>
            <span>{formatDuration(alive)}</span>
          </div>
          <div className="go-stat">
            <span>Evolutions</span>
            <span>{pet.totalEvolutions}</span>
          </div>
          <div className="go-stat">
            <span>Actions</span>
            <span>{pet.actionsPerformed}</span>
          </div>
          <div className="go-stat">
            <span>Events</span>
            <span>{pet.eventsCompleted}</span>
          </div>
          <div className="go-stat">
            <span>Generation</span>
            <span>#{pet.generation}</span>
          </div>
        </div>

        <div className="go-buttons">
          {isWin && (
            <button
              className="menu-btn menu-btn-primary"
              onClick={() => {
                newGamePlus();
                setTimeout(() => startGame(), 100);
              }}
            >
              🥚 New Game+ (Gen #{pet.generation + 1})
            </button>
          )}
          <button className="menu-btn menu-btn-secondary" onClick={resetGame}>
            ◆ New Specimen
          </button>
        </div>
      </div>
    </div>
  );
}
