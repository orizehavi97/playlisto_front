export interface Player {
  id: string;
  userId: string;
  name: string;
  score: number;
  isHost: boolean;
  isReady: boolean;
  hasGuessedCorrectly: boolean;
  currentRoundData: RoundData;
  gameHistory: GameHistory;
}

export interface RoundData {
  remainingGuesses: number;
  guessHistory: Guess[];
  lastSnippetDuration: number;
}

export interface Guess {
  guess: string;
  timestamp: number;
  wasCorrect: boolean;
  snippetDuration: number;
}

export interface GameHistory {
  correctGuesses: number;
  totalGuesses: number;
  averageGuessTime: number;
  bestScore: number;
}

export interface Lobby {
  id: string;
  players: Player[];
  hostId: string;
  gameState?: GameState;
  lastActivity: number;
  spotifyToken?: string;
}

export interface GameState {
  currentRound: number;
  hostId?: string;
  totalRounds: number;
  isPlaying: boolean;
  currentSong?: Song;
  correctSong?: CorrectSong;
  roundHistory?: RoundHistory[];
  players: Player[];
  playlist?: Playlist;
  snippetDuration?: number;
  spotifyToken?: string;
}

export interface Song {
  id: string;
  name: string;
  duration: number;
  startTime: number;
}

export interface CorrectSong {
  id: string;
  name: string;
  artists: string[];
}

export interface RoundHistory {
  songId: string;
  winners: string[];
  duration: number;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: Tracks;
  items: Track[];
  track: Track;
  preview_url?: string;
}

export interface Track {
  id: string;
  name: string;
  items: { track: any }[];
  preview_url?: string;
}

export interface Tracks {
  items: { track: Track }[];
}

export interface GameStartData {
  playlist: Playlist;
  gameState: GameState;
  spotifyToken: string;
}

export interface GuessResult {
  playerId: string;
  playerName?: string;
  correct: boolean;
  points?: number;
  guess: string;
  timeElapsed?: number;
}

// Define a type for the playlist item
export interface PlaylistItem {
  track: {
    preview_url?: string;
  };
}

export interface GameOverState {
  rankings: Array<{
    rank: number;
    name: string;
    score: number;
    isHost: boolean;
    userId: string;
  }>;
  totalRounds: number;
  playlistName?: string;
}

export interface CurrentGuessResult {
  correct: boolean;
  points?: number;
  message: string;
}

export type GameAction =
  | { type: "UPDATE_GAME_STATE"; payload: GameState }
  | {
      type: "START_ROUND";
      payload: { previewUrl: string; duration: number; startTime: number };
    }
  | { type: "END_ROUND"; payload: { correctSong?: GameState["correctSong"] } }
  | { type: "UPDATE_PLAYERS"; payload: Player[] }
  | { type: "RESET_GAME" };
