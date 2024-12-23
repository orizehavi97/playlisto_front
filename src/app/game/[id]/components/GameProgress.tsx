import { useGameContext } from "@/context/gameContext/useGameContext";
import { GameState } from "@/types/game";

const GameProgress = () => {
  const { gameState } = useGameContext();
  const { currentRound, totalRounds } = gameState;

  return (
    <div className="w-full bg-secondary/50 rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-full transition-all duration-500"
        style={{
          width: `${(currentRound / totalRounds) * 100}%`,
        }}
      />
    </div>
  );
};

export default GameProgress;
