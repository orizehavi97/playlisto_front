import { RoundTimer } from "@/app/game/[id]/components/roundTimer";
import SongSearch from "@/app/game/[id]/components/songSearch";
import { Badge } from "@/components/ui/badge";
import { useGameContext } from "@/context/gameContext/useGameContext";
import { CurrentGuessResult } from "@/types/game";
import useGameMetaInfo from "../hooks/useGameMetaInfo";
import useHandleGuess from "../hooks/useHandleGuess";
import GuessResultFeedback from "./GuessResultFeedback";

const GamePlay = ({
  currentGuessResult,
  snippetDuration,
}: {
  currentGuessResult: CurrentGuessResult | null;
  snippetDuration: number;
}) => {
  const { userId } = useGameMetaInfo();
  const { gameState, remainingGuesses, guessResults } = useGameContext();
  const { isPlaying, currentSong } = gameState;

  const handleGuess = useHandleGuess(snippetDuration);

  return (
    <div className="space-y-6">
      {isPlaying && (
        <div className="p-6 bg-secondary/30 rounded-xl">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Make Your Guess</h3>
              <div className="flex items-center gap-2">
                {currentSong && (
                  <RoundTimer
                    startTime={currentSong.startTime}
                    isPlaying={isPlaying}
                  />
                )}
                <Badge
                  variant={remainingGuesses > 1 ? "secondary" : "destructive"}
                >
                  {remainingGuesses} guesses remaining
                </Badge>
              </div>
            </div>
            {currentGuessResult ? (
              <GuessResultFeedback currentGuessResult={currentGuessResult} />
            ) : null}
            <SongSearch
              onGuess={handleGuess}
              disabled={remainingGuesses <= 0}
              hasGuessedCorrectly={
                gameState.players.find((p) => p.userId === userId)
                  ?.hasGuessedCorrectly
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
