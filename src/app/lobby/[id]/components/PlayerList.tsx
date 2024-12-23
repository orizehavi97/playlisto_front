import { Player } from "@/types/lobby";

const PlayerItem = ({ player }: { player: Player }) => {
  return (
    <div
      key={player.id}
      className="flex items-center justify-between p-2 rounded-lg bg-muted"
    >
      <div className="flex items-center gap-2">
        <span>{player.name}</span>
        {player.isHost && (
          <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded">
            Host
          </span>
        )}
      </div>
      {!player.isHost && (
        <span
          className={`text-sm ${
            player.isReady ? "text-green-500" : "text-yellow-500"
          }`}
        >
          {player.isReady ? "Ready" : "Not Ready"}
        </span>
      )}
    </div>
  );
};

const PlayerList = ({ players }: { players: Player[] }) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Players</h3>
      <div className="space-y-2">
        {players.map((player) => (
          <PlayerItem key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default PlayerList;
