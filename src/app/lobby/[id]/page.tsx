"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Music2, Users } from "lucide-react";
import { HostControls } from "./components/HostControls";
import PlayerList from "./components/PlayerList";
import PlaylistSelectionDialog from "./components/PlaylistSelectionDialog";
import { useLobby } from "./hooks/useLobby";
import useLobbyMetaInfo from "./hooks/useLobbyMetaInfo";
import { useSpotify } from "./hooks/useSpotify";

export default function LobbyPage() {
  const { id: lobbyId, isHost } = useLobbyMetaInfo();
  const { players, handleReady, isPlayerReady } = useLobby();

  const {
    spotifyToken,
    playlists,
    selectedPlaylist,
    setShowPlaylistDialog,
    handleSpotifyAuth,
    handleStartGame,
    showPlaylistDialog,
    handlePlaylistSelect,
  } = useSpotify();

  return (
    <main className="min-h-screen p-4 bg-gradient-to-b from-background to-muted">
      <div className="max-w-4xl mx-auto space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Music2 className="h-6 w-6" />
                <CardTitle>Lobby: {lobbyId}</CardTitle>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span>{players.length} players</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isHost && (
              <HostControls
                spotifyToken={spotifyToken}
                selectedPlaylist={selectedPlaylist}
                setShowPlaylistDialog={setShowPlaylistDialog}
                handleSpotifyAuth={handleSpotifyAuth}
                handleStartGame={handleStartGame}
                players={players}
              />
            )}
            <PlayerList players={players} />
            {!isHost && (
              <Button
                className="w-full"
                variant={isPlayerReady ? "outline" : "default"}
                onClick={handleReady}
              >
                {isPlayerReady ? "Not Ready" : "Ready"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <PlaylistSelectionDialog
        playlists={playlists}
        showPlaylistDialog={showPlaylistDialog}
        setShowPlaylistDialog={setShowPlaylistDialog}
        handlePlaylistSelect={handlePlaylistSelect}
      />
    </main>
  );
}
