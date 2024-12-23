import { Card, CardContent } from "@/components/ui/card";
import { useGameContext } from "@/context/gameContext/useGameContext";
import useAutoStartRound from "../hooks/useAutoStartRound";
import useGame from "../hooks/useGame";
import useReconnection from "../hooks/useReconnection";
import GameHeader from "./GameHeader";
import GameInfo from "./GameInfo";
import GamePlay from "./GamePlay";
import GameProgress from "./GameProgress";
import HostControls from "./HostControls";

const GameContainer = () => {
  const { isHost, availableSongs } = useGame();
  const { currentGuessResult, snippetDuration } = useGameContext();

  useAutoStartRound(isHost, availableSongs);
  useReconnection();

  return (
    <Card className="shadow-2xl border-none">
      <GameHeader />
      <CardContent className="p-6 space-y-8">
        <GameProgress />
        {isHost && (
          <HostControls
            isHost={isHost}
            availableSongs={availableSongs}
            snippetDuration={snippetDuration}
          />
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GamePlay
            currentGuessResult={currentGuessResult}
            snippetDuration={snippetDuration}
          />
          <GameInfo />
        </div>
      </CardContent>
    </Card>
  );
};

export default GameContainer;
