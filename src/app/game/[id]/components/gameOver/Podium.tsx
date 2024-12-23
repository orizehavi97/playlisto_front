import { cn } from "@/lib/utils";
import { GameOverState } from "@/types/game";
import { Crown, Medal, Trophy } from "lucide-react";

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Crown className="h-8 w-8 text-yellow-400" />;
    case 2:
      return <Medal className="h-7 w-7 text-gray-400" />;
    case 3:
      return <Medal className="h-6 w-6 text-amber-600" />;
    default:
      return <Trophy className="h-5 w-5 text-primary" />;
  }
};

const Podium = ({ topThree }: { topThree: GameOverState["rankings"] }) => (
  <div className="flex justify-center items-end gap-4 h-64 mb-8">
    {topThree.map((player, index) => (
      <div
        key={player.userId}
        className="flex flex-col items-center"
        style={{
          height: `${index === 0 ? "100%" : index === 1 ? "85%" : "70%"}`,
        }}
      >
        <div
          className={cn(
            "flex-1 w-32 flex flex-col items-center justify-end p-4 rounded-t-lg",
            index === 0 && "bg-yellow-100 dark:bg-yellow-900/30",
            index === 1 && "bg-gray-100 dark:bg-gray-900/30",
            index === 2 && "bg-amber-100 dark:bg-amber-900/30"
          )}
        >
          {getRankIcon(index + 1)}
          <span className="font-bold text-lg mt-2">{player.name}</span>
          <span className="text-sm text-muted-foreground">
            {player.score} points
          </span>
        </div>
      </div>
    ))}
  </div>
);

export default Podium;
