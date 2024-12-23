import { useGameContext } from "@/context/gameContext/useGameContext";
import useGameMetaInfo from "./useGameMetaInfo";

const useHandleGuess = (snippetDuration: number) => {
  const { id: gameId, userId, socket } = useGameMetaInfo();
  const { gameState, remainingGuesses, setRemainingGuesses } = useGameContext();

  return (songName: string) => {
    if (!socket || remainingGuesses <= 0 || !gameState.isPlaying) return;

    const currentPlayer = gameState.players.find((p) => p.userId === userId);
    if (currentPlayer?.hasGuessedCorrectly) return;

    socket.emit("submitGuess", { lobbyId: gameId, songName, snippetDuration });
    setRemainingGuesses((prev: number) => prev - 1);
  };
};

export default useHandleGuess;
