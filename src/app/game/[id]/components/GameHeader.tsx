import { CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/gameContext/useGameContext";
import { GameState } from "@/types/game";
import { Music2 } from "lucide-react";

const GameHeader = () => {
  const { gameState } = useGameContext();
  const { currentRound, totalRounds, isPlaying } = gameState;

  return (
    <CardHeader className="border-b border-border/10">
      <div className="flex justify-between items-center">
        <CardTitle className="flex items-center gap-3 text-2xl">
          <Music2 className="h-7 w-7 text-primary" />
          Round {currentRound} of {totalRounds}
        </CardTitle>
        <span className="text-sm font-medium px-4 py-1.5 rounded-full bg-secondary/50">
          {isPlaying ? "Playing" : "Waiting"}
        </span>
      </div>
    </CardHeader>
  );
};

export default GameHeader;
