import { useEffect, useState } from 'react';
import { useGameStore } from '@/stores/petStore';
import { initMetrics, stopMetrics } from '@/utils/metrics';
import { Background } from '@/components/Environment/Background';
import { PetSprite } from '@/components/Pet/PetSprite';
import { StatsBar } from '@/components/Stats/StatsBar';
import { ActionPanel } from '@/components/Actions/ActionPanel';
import { EventModal } from '@/components/Events/EventModal';
import { StageIndicator } from '@/components/HUD/StageIndicator';
import { GameLog } from '@/components/HUD/GameLog';
import { MainMenu } from '@/components/Menu/MainMenu';
import { GameOver } from '@/components/Menu/GameOver';
import { Settings } from '@/components/Menu/Settings';

export default function App() {
  const gameStarted = useGameStore((s) => s.gameStarted);
  const pet = useGameStore((s) => s.pet);
  const startGame = useGameStore((s) => s.startGame);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    initMetrics();
    return () => stopMetrics();
  }, []);

  useEffect(() => {
    if (gameStarted && pet.isAlive) {
      startGame();
    }
  }, []);

  const isGameOver = !pet.isAlive || pet.hasWon;

  if (!gameStarted) {
    return (
      <div className="app">
        <MainMenu />
      </div>
    );
  }

  return (
    <div className="app">
      <Background>
        <div className="game-layout">
          <div className="game-left">
            <StageIndicator />
            <StatsBar />
            <GameLog />
          </div>

          <div className="game-center">
            <PetSprite />
            <ActionPanel />
          </div>

          <div className="game-right">
            <button
              className="settings-btn"
              onClick={() => setShowSettings(true)}
              title="Settings"
            >
              ⚙
            </button>
          </div>
        </div>
      </Background>

      <EventModal />
      {isGameOver && <GameOver />}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </div>
  );
}
