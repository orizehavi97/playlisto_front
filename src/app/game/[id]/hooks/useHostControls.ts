import { useGameContext } from "@/context/gameContext/useGameContext";
import { DEFAULT_SNIPPET_DURATION } from "../constants";
import useGameMetaInfo from "./useGameMetaInfo";

const useHostControls = (isHost: boolean) => {
  const { id: gameId, socket } = useGameMetaInfo();
  const { gameState, setErrorMessage } = useGameContext();

  const handleStartRound = async () => {
    if (!socket || !isHost) return;

    try {
      socket.emit("startRound", { lobbyId: gameId });
    } catch (error) {
      console.error("Error starting round:", error);
      setErrorMessage("Failed to start round. Please try again.");
    }
  };

  const handleSkipRound = () => {
    if (!socket) return;
    socket.emit("endRound", { lobbyId: gameId });
  };

  const handleExtendDuration = (additionalTime: number) => {
    if (!socket || !isHost) return;

    const newDuration =
      (gameState.snippetDuration || DEFAULT_SNIPPET_DURATION) + additionalTime;

    socket.emit("extendDuration", {
      lobbyId: gameId,
      newDuration,
    });
  };

  const handlePlaybackComplete = () => {
    if (isHost && socket) {
      socket.emit("roundEnd", { lobbyId: gameId });
    }
  };

  return {
    handleStartRound,
    handleSkipRound,
    handleExtendDuration,
    handlePlaybackComplete,
  };
};

export default useHostControls;
