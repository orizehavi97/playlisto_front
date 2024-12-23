// create custom hook to listen for return to lobby event boiler plate

import { Player } from "@/types/game";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import useGameMetaInfo from "./useGameMetaInfo";

export const useReturnToLobbyListner = () => {
  const { id: gameId, userId, socket } = useGameMetaInfo();
  const router = useRouter();

  const handleReturnToLobby = useCallback(
    (data: any) => {
      const currentPlayer = data.players.find(
        (p: Player) => p.userId === userId
      );

      const playerName = currentPlayer?.name;
      const isHost = currentPlayer?.isHost;
      const name = encodeURIComponent(playerName ?? "");
      const lobbyURL = `/lobby/${gameId}?name=${name}&host=${isHost}`;

      sessionStorage.removeItem("initialGameState");

      router.push(lobbyURL);
    },
    [gameId, router, userId]
  );

  // Add socket listener for returnToLobby event
  useEffect(() => {
    if (!socket) return;

    socket.on("returnToLobby", handleReturnToLobby);

    return () => {
      socket.off("returnToLobby");
    };
  }, [socket, gameId, userId, router, handleReturnToLobby]);
};

export default useReturnToLobbyListner;
