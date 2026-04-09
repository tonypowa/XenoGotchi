import { useGameStore } from '@/stores/petStore';

export function MainMenu() {
  const startGame = useGameStore((s) => s.startGame);
  const resetGame = useGameStore((s) => s.resetGame);
  const pet = useGameStore((s) => s.pet);

  const hasSave = pet.stage !== 'ovomorph' || pet.hostLured;

  return (
    <div className="main-menu">
      <div className="menu-title-container">
        <pre className="menu-logo">{`
 ██╗  ██╗███████╗███╗   ██╗ ██████╗  ██████╗  ██████╗ ████████╗ ██████╗██╗  ██╗██╗
 ╚██╗██╔╝██╔════╝████╗  ██║██╔═══██╗██╔════╝ ██╔═══██╗╚══██╔══╝██╔════╝██║  ██║██║
  ╚███╔╝ █████╗  ██╔██╗ ██║██║   ██║██║  ███╗██║   ██║   ██║   ██║     ███████║██║
  ██╔██╗ ██╔══╝  ██║╚██╗██║██║   ██║██║   ██║██║   ██║   ██║   ██║     ██╔══██║██║
 ██╔╝ ██╗███████╗██║ ╚████║╚██████╔╝╚██████╔╝╚██████╔╝   ██║   ╚██████╗██║  ██║██║
 ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝  ╚═════╝    ╚═╝    ╚═════╝╚═╝  ╚═╝╚═╝
        `}</pre>
        <p className="menu-tagline">In space, no one can hear it purr.</p>
      </div>

      <div className="menu-buttons">
        {hasSave && (
          <button className="menu-btn menu-btn-primary" onClick={startGame}>
            ▶ Continue
          </button>
        )}
        <button
          className="menu-btn menu-btn-secondary"
          onClick={() => {
            resetGame();
            setTimeout(() => useGameStore.getState().startGame(), 100);
          }}
        >
          ◆ New Specimen
        </button>
      </div>

      <div className="menu-info">
        <p>Raise a Xenomorph from egg to Queen.</p>
        <p>Manage stats. Survive events. Evolve.</p>
        <p className="menu-metrics">Metrics sent to Grafana Cloud</p>
      </div>
    </div>
  );
}
