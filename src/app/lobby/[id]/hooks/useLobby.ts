import { Player } from "@/types/lobby";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useLobbyMetaInfo from "./useLobbyMetaInfo";
import { useSpotify } from "./useSpotify";

export const useLobby = () => {
  const router = useRouter();
  const {
    id: lobbyId,
    playerName,
    isHost,
    userId,
    socket,
    isConnected,
  } = useLobbyMetaInfo();
  const { setSelectedPlaylist } = useSpotify();

  const [players, setPlayers] = useState<Player[]>([]);
  const [isReady, setIsReady] = useState(false);

  // Handle ready state
  const handleReady = () => {
    if (!socket) return;
    socket.emit("toggleReady", { lobbyId });
    setIsReady(!isReady);
  };

  // Join the lobby
  useEffect(() => {
    if (!socket || !isConnected || !playerName || !lobbyId || !userId) return;

    socket.emit("joinLobby", {
      lobbyId,
      playerName,
      isHost,
      userId,
    });
  }, [socket, isConnected, playerName, lobbyId, userId, isHost]);

  // handle
  useEffect(() => {
    if (!socket || !userId) return;

    sessionStorage.removeItem("initialGameState");

    socket.on("lobbyUpdate", (lobby) => {
      setPlayers(lobby.players);
      if (lobby.spotifyPlaylist && isHost) {
        setSelectedPlaylist(lobby.spotifyPlaylist);
      }
      const currentPlayer = lobby.players.find(
        (p: Player) => p.userId === userId
      );
      if (currentPlayer) {
        setIsReady(currentPlayer.isReady);
      }
    });

    socket.on("gameStart", ({ gameState, playlist }) => {
      router.push(`/game/${lobbyId}`);
    });

    socket.on("gameState", (gameState) => {
      sessionStorage.setItem("initialGameState", JSON.stringify(gameState));
      router.push(`/game/${lobbyId}`);
    });

    socket.on("error", (message) => {
      alert(message);
      router.push("/");
    });

    return () => {
      socket.off("lobbyUpdate");
      socket.off("gameStart");
      socket.off("error");
      socket.emit("leaveLobby", { lobbyId, userId });
    };
  }, [socket, lobbyId, router, userId, isHost, setSelectedPlaylist]);

  const currentPlayer = players.find((p) => p.id === socket?.id);
  const isPlayerReady = currentPlayer?.isReady || false;

  return {
    players,
    isReady,
    setIsReady,
    handleReady,
    currentPlayer,
    isPlayerReady,
  };
};
