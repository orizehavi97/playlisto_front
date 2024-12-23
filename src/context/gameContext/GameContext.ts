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
import { createContext } from "react";

type GameContextType = {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  gameOver: GameOverState | null;
  setGameOver: React.Dispatch<React.SetStateAction<GameOverState | null>>;
  isGameOver: boolean;
  guessResults: GuessResult[];
  setGuessResults: React.Dispatch<React.SetStateAction<GuessResult[]>>;
  remainingGuesses: number;
  setRemainingGuesses: React.Dispatch<React.SetStateAction<number>>;
  errorMessage: string | null;
  setErrorMessage: React.Dispatch<React.SetStateAction<string | null>>;
  spotifyToken: string | null;
  setSpotifyToken: React.Dispatch<React.SetStateAction<string | null>>;
  currentGuessResult: CurrentGuessResult | null;
  setCurrentGuessResult: React.Dispatch<
    React.SetStateAction<CurrentGuessResult | null>
  >;
  snippetDuration: number;
  setSnippetDuration: React.Dispatch<React.SetStateAction<number>>;
};

const initialContext: GameContextType = {
  gameState: {} as GameState,
  setGameState: () => {},
  gameOver: {} as GameOverState,
  setGameOver: () => {},
  isGameOver: false,
  guessResults: [],
  setGuessResults: () => {},
  remainingGuesses: INITIAL_GUESSES_AVAILABLE,
  setRemainingGuesses: () => {},
  errorMessage: null,
  setErrorMessage: () => {},
  spotifyToken: null,
  setSpotifyToken: () => {},
  currentGuessResult: null,
  setCurrentGuessResult: () => {},
  snippetDuration: DEFAULT_SNIPPET_DURATION,
  setSnippetDuration: () => {},
};

const GameContext = createContext(initialContext);

export default GameContext;
