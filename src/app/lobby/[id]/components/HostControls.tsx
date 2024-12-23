import React from "react";
import { Button } from "@/components/ui/button";
import { SpotifyAuth } from "@/components/spotifyAuth";
import Image from "next/image";
import { Player, Playlist } from "@/types/lobby";

interface HostControlsProps {
  spotifyToken: string | null;
  selectedPlaylist: Playlist | null;
  setShowPlaylistDialog: (show: boolean) => void;
  handleSpotifyAuth: (token: string) => void;
  handleStartGame: () => void;
  players: Player[];
}

export const HostControls = ({
  spotifyToken,
  selectedPlaylist,
  setShowPlaylistDialog,
  handleSpotifyAuth,
  handleStartGame,
  players,
}: HostControlsProps) => {
  return (
    <div className="space-y-4 p-4 bg-muted rounded-lg">
      <h3 className="font-semibold">Host Controls</h3>
      {!spotifyToken ? (
        <SpotifyAuth onSuccess={handleSpotifyAuth} />
      ) : (
        <div className="space-y-2">
          {selectedPlaylist ? (
            <div className="flex items-center justify-between p-2 bg-background rounded-lg">
              <div className="flex items-center gap-2">
                {selectedPlaylist.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPlaylist.imageUrl}
                    alt={selectedPlaylist.name}
                    className="w-10 h-10 rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{selectedPlaylist.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {typeof selectedPlaylist.tracks === "number"
                      ? selectedPlaylist.tracks
                      : selectedPlaylist.tracks.items.length}{" "}
                    tracks
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowPlaylistDialog(true)}
              >
                Change Playlist
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={() => setShowPlaylistDialog(true)}
            >
              Select Playlist
            </Button>
          )}
          <Button
            className="w-full"
            disabled={
              !selectedPlaylist ||
              !players.filter((p) => !p.isHost).every((p) => p.isReady)
            }
            onClick={handleStartGame}
          >
            Start Game
          </Button>
        </div>
      )}
    </div>
  );
};
