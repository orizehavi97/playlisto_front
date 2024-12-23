import { useEffect } from "react";
import useGameMetaInfo from "./useGameMetaInfo";

const useReconnection = () => {
  const { id: gameId, userId, socket, isConnected } = useGameMetaInfo();

  useEffect(() => {
    if (!socket || !isConnected) return;
    // Re-join the game room
    socket.emit("requestGameState", { gameId, userId });
  }, [gameId, isConnected, socket, userId]);
};

export default useReconnection;
