import { AudioPlayer } from "@/app/game/[id]/components/audioPlayer";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/context/gameContext/useGameContext";
import { PlaylistItem } from "@/types/game";
import { Crown, Play } from "lucide-react";
import useHostControls from "../hooks/useHostControls";

const HostControls = ({
  isHost,
  availableSongs,
  snippetDuration,
}: {
  isHost: boolean;
  availableSongs: PlaylistItem[];
  snippetDuration: number;
}) => {
  const { gameState, spotifyToken } = useGameContext();
  const { currentRound, isPlaying, currentSong } = gameState;

  const {
    handleStartRound,
    handleSkipRound,
    handleExtendDuration,
    handlePlaybackComplete,
  } = useHostControls(isHost);

  return currentRound > 0 ? (
    <div className="p-6 bg-secondary/30 rounded-xl space-y-4">
      <h3 className="font-semibold flex items-center gap-2 text-lg">
        <Crown className="h-5 w-5 text-primary" />
        Host Controls
      </h3>
      <div className="flex flex-col gap-4">
        {currentSong && isPlaying && (
          <div className="flex items-center gap-2">
            <AudioPlayer
              songId={currentSong.id}
              duration={snippetDuration}
              onPlaybackComplete={handlePlaybackComplete}
              isHost={isHost}
              onExtendDuration={handleExtendDuration}
              onSkipRound={handleSkipRound}
              spotifyToken={spotifyToken || ""}
              showControls={true}
            />
          </div>
        )}
        {!isPlaying && (
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleStartRound}
            disabled={!availableSongs.length}
          >
            <Play className="h-4 w-4 mr-2" />
            Start Next Round
          </Button>
        )}
      </div>
    </div>
  ) : null;
};

export default HostControls;
