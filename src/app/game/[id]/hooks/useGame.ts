import { useGameContext } from "@/context/gameContext/useGameContext";
import { GameOverState, GameState, GuessResult } from "@/types/game";
import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_SNIPPET_DURATION,
  GAME_STATUSES,
  INITIAL_GUESSES_AVAILABLE,
} from "../constants";
import useGameMetaInfo from "./useGameMetaInfo";

const useGame = () => {
  const { socket, isConnected, userId, id: gameId } = useGameMetaInfo();
  const {
    spotifyToken,
    setSpotifyToken,
    gameState,
    setGameState,
    setGameOver,
    setGuessResults,
    setRemainingGuesses,
    setCurrentGuessResult,
    setSnippetDuration,
  } = useGameContext();

  const [isHost, setIsHost] = useState<boolean>(false);
  const [availableSongs, setAvailableSongs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gameStatus, setGameStatus] = useState<string>(
    GAME_STATUSES.WAITING_TO_START_ROUND
  );

  const [error, setError] = useState<string | null>(null);

  // Add effect to handle loading timeout
  useEffect(() => {
    if (!isLoading) return;

    const timeout = setTimeout(() => {
      socket?.emit("requestGameState", { gameId, userId });
    }, 3000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isLoading, socket, gameId, userId]);

  const initializeGameState = useCallback(
    (state: GameState) => {
      setGameState(state);
      setIsHost(state.hostId === userId);
      if (state.spotifyToken) setSpotifyToken(state.spotifyToken);
      if (state.playlist?.tracks?.items) {
        const songs = state.playlist.tracks.items
          .filter((item) => item.track)
          .map((item) => item.track);
        setAvailableSongs(songs);
      }
      setIsLoading(false);
    },
    [
      setAvailableSongs,
      setGameState,
      setIsHost,
      setIsLoading,
      setSpotifyToken,
      userId,
    ]
  );

  const handleGuessResult = useCallback(
    (result: any) => {
      setGuessResults((prev: GuessResult[]) => {
        const newResults = [result, ...prev].slice(0, 10);
        return newResults;
      });

      if (result.correct) {
        setGameState((prev: GameState) => {
          const updatedState = {
            ...prev,
            players: prev.players.map((p) =>
              p.id === result.playerId
                ? {
                    ...p,
                    score: (p.score || 0) + (result.points || 0),
                    hasGuessedCorrectly: true,
                  }
                : p
            ),
          };
          return updatedState;
        });
      }
    },
    [setGameState, setGuessResults]
  );

  const handleGameStateUpdate = useCallback(
    (newGameState: GameState) => {
      setGameState(newGameState);
      setSnippetDuration(
        newGameState.snippetDuration || DEFAULT_SNIPPET_DURATION
      );
      if (!newGameState.isPlaying) {
        setRemainingGuesses(INITIAL_GUESSES_AVAILABLE);
        setCurrentGuessResult(null);
      }
    },
    [
      setCurrentGuessResult,
      setGameState,
      setRemainingGuesses,
      setSnippetDuration,
    ]
  );

  const handleGameOver = useCallback(
    (gameOverState: GameOverState) => {
      setGameOver(gameOverState);
    },
    [setGameOver]
  );

  // Add effect to handle initial state
  useEffect(() => {
    const storedState = sessionStorage.getItem("initialGameState");
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      initializeGameState(parsedState);
      sessionStorage.removeItem("initialGameState");
    }
  }, [initializeGameState, userId]);

  // Update socket effect to properly handle game state
  useEffect(() => {
    if (!socket || !isConnected || !userId) return;

    socket.on("gameState", initializeGameState);

    if (!sessionStorage.getItem("initialGameState")) {
      socket.emit("requestGameState", { gameId, userId });
    }

    socket.on("error", (error: string) => {
      setError(error);
      setIsLoading(false);
    });

    return () => {
      socket.off("gameState");
      socket.off("error");
    };
  }, [
    socket,
    isConnected,
    userId,
    gameId,
    initializeGameState,
    setError,
    setIsLoading,
  ]);

  // Update the useEffect that handles game status
  useEffect(() => {
    if (gameState.isPlaying) {
      setGameStatus(GAME_STATUSES.ROUND_IN_PROGRESS);
    } else if (isHost && gameState.currentRound > 0) {
      setGameStatus(GAME_STATUSES.START_NEXT_ROUND);
    } else {
      setGameStatus(GAME_STATUSES.WAITING_TO_START_ROUND);
    }
  }, [gameState.isPlaying, gameState.currentRound, isHost]);

  useEffect(() => {
    if (!socket) return;

    socket.on("gameStart", initializeGameState);

    socket.on(
      "roundStart",
      ({ duration, serverTime }: { duration: any; serverTime: any }) => {
        setRemainingGuesses(INITIAL_GUESSES_AVAILABLE);
        setGuessResults([]);
        setGameState((prev) => ({
          ...prev,
          isPlaying: true,
          currentSong: {
            id: `temp-${Date.now()}`,
            name: `temp-${Date.now()}`,
            duration,
            startTime: serverTime,
          },
        }));
      }
    );

    // Add a separate effect to handle game state updates
    socket.on("gameState", handleGameStateUpdate);

    // Add a separate effect to handle guess results
    socket.on("guessResult", handleGuessResult);

    socket.on("roundEnd", ({ nextRound }: { nextRound: number }) => {
      setRemainingGuesses(INITIAL_GUESSES_AVAILABLE);
      setCurrentGuessResult(null);
      setSnippetDuration(DEFAULT_SNIPPET_DURATION);
      setGameState((prev: GameState) => ({
        ...prev,
        isPlaying: false,
        currentSong: undefined,
        currentRound: nextRound,
        snippetDuration: DEFAULT_SNIPPET_DURATION,
      }));
    });

    socket.on("gameOver", handleGameOver);

    return () => {
      socket.off("gameStart");
      socket.off("roundStart");
      socket.off("gameState");
      socket.off("guessResult");
      socket.off("roundEnd");
      socket.off("gameOver");
    };
  }, [
    handleGameOver,
    handleGameStateUpdate,
    handleGuessResult,
    initializeGameState,
    setCurrentGuessResult,
    setGameState,
    setGuessResults,
    setRemainingGuesses,
    setSnippetDuration,
    socket,
  ]);

  // Reset snippet duration when round changes
  useEffect(() => {
    if (!gameState.isPlaying) {
      setRemainingGuesses(INITIAL_GUESSES_AVAILABLE);
      setSnippetDuration(DEFAULT_SNIPPET_DURATION);
    }
  }, [gameState.isPlaying, setRemainingGuesses, setSnippetDuration]);

  return {
    isHost,
    availableSongs,
    spotifyToken,
    isLoading,
    gameStatus,
    error,
  };
};

export default useGame;
