import { useEffect } from "react";
import { GameState } from "@/types/game";
import { useGameContext } from "@/context/gameContext/useGameContext";
import useGameMetaInfo from "./useGameMetaInfo";

const useAutoStartRound = (isHost: boolean, availableSongs: any[]) => {
  const { id: gameId, socket } = useGameMetaInfo();
  const { gameState } = useGameContext();

  useEffect(() => {
    if (!isHost || !socket || !gameState.isPlaying || !availableSongs.length)
      return;

    if (!gameState.currentSong) {
      socket.emit("startRound", { lobbyId: gameId });
    }
  }, [
    isHost,
    socket,
    gameState.isPlaying,
    gameState.currentSong,
    availableSongs,
    gameId,
  ]);
};

export default useAutoStartRound;
