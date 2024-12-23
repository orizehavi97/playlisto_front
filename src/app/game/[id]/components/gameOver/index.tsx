import useGameMetaInfo from "@/app/game/[id]/hooks/useGameMetaInfo";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGameContext } from "@/context/gameContext/useGameContext";
import { GameOverState } from "@/types/game";
import { Home, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import OtherPlayers from "./OtherPlayers";
import Podium from "./Podium";

function GameOverScreen() {
  const { id: gameId, userId, socket } = useGameMetaInfo();
  const { gameState, gameOver } = useGameContext();
  const router = useRouter();

  const { rankings, playlistName } = gameOver as GameOverState;
  const topThree = rankings.slice(0, 3);

  const handleReturnToLobby = () => {
    if (!socket) return;

    const playerName = gameState.players.find((p) => p.userId === userId)?.name;
    const isHost = gameState.hostId === userId;
    const name = encodeURIComponent(playerName ?? "");
    const lobbyURL = `/lobby/${gameId}?name=${name}&host=${isHost}`;

    socket.emit("returnToLobby", { lobbyId: gameId });

    router.push(lobbyURL);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center border-b border-border/10">
        <CardTitle className="text-3xl font-bold">Game Over!</CardTitle>
        {playlistName && (
          <p className="text-muted-foreground">Playlist: {playlistName}</p>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <Podium topThree={topThree} />
        <OtherPlayers rankings={rankings.slice(3)} />
        <div className="flex justify-center gap-4 pt-4">
          <Button
            variant="outline"
            className="w-48"
            onClick={handleReturnToLobby}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Return to Lobby
          </Button>
          <Button
            variant="default"
            className="w-48"
            onClick={() => router.push("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Exit to Home
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default GameOverScreen;
