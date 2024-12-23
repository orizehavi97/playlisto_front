"use client";

import {
  DEFAULT_SNIPPET_DURATION,
  INITIAL_GUESSES_AVAILABLE,
} from "@/app/game/[id]/constants";
import {
  CurrentGuessResult,
  GameOverState,
  GameState,
  GuessResult,
} from "@/types/game";
import { useState } from "react";
import GameContext from "./GameContext";

const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [spotifyToken, setSpotifyToken] = useState<string | null>(null);

  // general game state
  const [gameState, setGameState] = useState<GameState>({
    currentRound: 1,
    totalRounds: 10,
    players: [],
    isPlaying: false,
    snippetDuration: DEFAULT_SNIPPET_DURATION,
  });
  const [gameOver, setGameOver] = useState<GameOverState | null>(null);
  const isGameOver = !!gameOver;

  // guess state
  const [guessResults, setGuessResults] = useState<GuessResult[]>([]);
  const [remainingGuesses, setRemainingGuesses] = useState(
    INITIAL_GUESSES_AVAILABLE
  );
  const [currentGuessResult, setCurrentGuessResult] =
    useState<CurrentGuessResult | null>(null);

  // snippet duration state
  const [snippetDuration, setSnippetDuration] = useState(
    DEFAULT_SNIPPET_DURATION
  );

  // error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        gameOver,
        setGameOver,
        isGameOver,
        guessResults,
        setGuessResults,
        remainingGuesses,
        setRemainingGuesses,
        errorMessage,
        setErrorMessage,
        spotifyToken,
        setSpotifyToken,
        currentGuessResult,
        setCurrentGuessResult,
        snippetDuration,
        setSnippetDuration,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export { GameProvider };
