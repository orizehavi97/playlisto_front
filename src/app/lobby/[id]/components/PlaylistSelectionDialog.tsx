import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Playlist } from "@/types/lobby";

interface PlaylistSelectionDialogProps {
  playlists: Playlist[];
  showPlaylistDialog: boolean;
  setShowPlaylistDialog: (show: boolean) => void;
  handlePlaylistSelect: (playlist: Playlist) => void;
}

const PlaylistSelectionDialog = ({
  playlists,
  showPlaylistDialog,
  setShowPlaylistDialog,
  handlePlaylistSelect,
}: PlaylistSelectionDialogProps) => {
  return (
    <Dialog open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Select a Playlist</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {playlists.map((playlist) => (
            <Button
              key={playlist.id}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2"
              onClick={() => handlePlaylistSelect(playlist)}
            >
              {playlist.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={playlist.imageUrl}
                  alt={playlist.name}
                  className="w-full aspect-square object-cover rounded-md"
                />
              )}
              <div className="text-left">
                <p className="font-medium">{playlist.name}</p>
                <p className="text-sm text-muted-foreground">
                  {typeof playlist.tracks === "number"
                    ? playlist.tracks
                    : playlist.tracks.items.length}{" "}
                  tracks
                </p>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlaylistSelectionDialog;
