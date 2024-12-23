import { GameState, GuessResult } from "@/types/game";
import RecentGuesses from "./RecentGuesses";
import Scoreboard from "./Scoreboard";
import { useGameContext } from "@/context/gameContext/useGameContext";

const GameInfo = () => {
  return (
    <div className="space-y-6">
      <RecentGuesses />
      <Scoreboard />
    </div>
  );
};

export default GameInfo;
