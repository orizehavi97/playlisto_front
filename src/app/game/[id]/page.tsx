"use client";

import GameOverScreen from "@/app/game/[id]/components/gameOver";
import { useGameContext } from "@/context/gameContext/useGameContext";
import GameContainer from "./components/GameContainer";
import LoadingGame from "./components/LoadingGame";
import useGameMetaInfo from "./hooks/useGameMetaInfo";
import useReturnToLobbyListner from "./hooks/useReturnToLobbyListner";

export default function GamePage() {
  const { isConnected } = useGameMetaInfo();
  const { isGameOver } = useGameContext();

  useReturnToLobbyListner();

  return (
    <main className="container max-w-7xl mx-auto p-4 md:p-8">
      <div className="min-h-[80vh]">
        {!isConnected ? (
          <LoadingGame />
        ) : isGameOver ? (
          <GameOverScreen />
        ) : (
          <GameContainer />
        )}
      </div>
    </main>
  );
}
