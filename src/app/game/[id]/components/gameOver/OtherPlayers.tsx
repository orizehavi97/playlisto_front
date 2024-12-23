import { GameOverState } from "@/types/game";

const OtherPlayers = ({ rankings }: { rankings: GameOverState["rankings"] }) =>
  rankings.length > 0 && (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-4">Other Players</h3>
      {rankings.map((player) => (
        <div
          key={player.userId}
          className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">#{player.rank}</span>
            <span>{player.name}</span>
          </div>
          <span className="font-medium">{player.score} points</span>
        </div>
      ))}
    </div>
  );

export default OtherPlayers;
