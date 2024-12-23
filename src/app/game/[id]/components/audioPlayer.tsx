"use client";

import { startPlayback, transferPlaybackToDevice } from "@/api/spotify";
import useSpotifyPlayer from "@/app/game/[id]/hooks/useSpotifyPlayer";
import { Loader2, Play, Plus, SkipForward } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../../../components/ui/button";

interface AudioPlayerProps {
  songId: string | undefined;
  duration: number;
  onPlaybackComplete: () => void;
  isHost: boolean;
  onExtendDuration: (additionalTime: number) => void;
  onSkipRound: () => void;
  spotifyToken: string;
  showControls?: boolean;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  songId,
  duration,
  onPlaybackComplete,
  isHost,
  onExtendDuration,
  onSkipRound,
  spotifyToken,
  showControls = true,
}) => {
  const playbackTimeout = useRef<NodeJS.Timeout>();
  const [error, setError] = useState<string | null>(null);

  const {
    player,
    deviceId,
    isLoading,
    isPlaying,
    setIsPlaying,
    error: spotifyPlayerError,
  } = useSpotifyPlayer(showControls, spotifyToken);

  // Modified play function to handle snippet playback with compensation for delay
  const playSnippet = async () => {
    if (!deviceId || !songId || !spotifyToken) return;

    try {
      clearExistingPlayback();

      // Start a timestamp to measure actual playback start
      const startTime = Date.now();

      await transferPlaybackToDevice(deviceId, spotifyToken);
      await startPlayback(deviceId, songId, spotifyToken);

      setIsPlaying(true);

      // Calculate the actual delay in starting playback
      // and adjust the duration to compensate for the delay
      const actualDelay = Date.now() - startTime;
      const adjustedDuration = duration + actualDelay;

      // Set timeout to stop playback after adjusted duration
      schedulePlaybackStop(adjustedDuration);
    } catch (error) {
      setError("Failed to play song");
    }
  };

  const clearExistingPlayback = () => {
    if (playbackTimeout.current) {
      clearTimeout(playbackTimeout.current);
    }
    if (isPlaying) {
      player?.pause();
    }
  };

  const schedulePlaybackStop = (adjustedDuration: number) => {
    playbackTimeout.current = setTimeout(async () => {
      await player?.pause();
      setIsPlaying(false);
    }, adjustedDuration);
  };

  // Cleanup on unmount or songId change
  useEffect(() => {
    return () => {
      if (playbackTimeout.current) {
        clearTimeout(playbackTimeout.current);
      }
      player?.pause();
    };
  }, [songId, player]);

  // Only render controls if showControls is true
  if (!showControls) {
    return null;
  }

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex items-center justify-center h-12">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2 text-sm text-muted-foreground">
            Initializing player...
          </span>
        </div>
      ) : error || spotifyPlayerError ? (
        <div className="text-destructive text-sm">
          {error || spotifyPlayerError}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant={isPlaying ? "secondary" : "default"}
            onClick={playSnippet}
            disabled={!player || !deviceId || isPlaying}
          >
            <Play className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => onExtendDuration(500)}
            disabled={isPlaying}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={onSkipRound}
            disabled={isPlaying}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground ml-2">
            {(duration / 1000).toFixed(1)}s
          </span>
        </div>
      )}
    </div>
  );
};
