import { useState } from "react";
import { useGameContext } from "@/context/gameContext/useGameContext";
import useLobbyMetaInfo from "./useLobbyMetaInfo";
import { fetchPlaylists, fetchPlaylistDetails } from "@/api/spotify";

interface Playlist {
  id: string;
  name: string;
  tracks: number | { items: any[] };
  imageUrl?: string;
}

export const useSpotify = () => {
  const { id: lobbyId, socket } = useLobbyMetaInfo();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(
    null
  );
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const { spotifyToken, setSpotifyToken } = useGameContext();

  const handleSpotifyAuth = async (token: string) => {
    try {
      setSpotifyToken(token);

      const data = await fetchPlaylists(token);
      const formattedPlaylists = data.items
        .filter((item: any) => item && item.tracks)
        .map((item: any) => ({
          id: item.id,
          name: item.name || "Unnamed Playlist",
          tracks: item.tracks.total || 0,
          imageUrl: item.images?.[0]?.url || null,
        }));

      setPlaylists(formattedPlaylists);
      setShowPlaylistDialog(true);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      alert("Failed to load playlists. Please try again.");
    }
  };

  const handlePlaylistSelect = async (playlist: Playlist) => {
    try {
      const completePlaylist = await fetchPlaylistDetails(
        playlist.id,
        spotifyToken!
      );

      setSelectedPlaylist(completePlaylist);
      setShowPlaylistDialog(false);
    } catch (error) {
      console.error("Error fetching playlist details:", error);
    }
  };

  const handleStartGame = async () => {
    if (!socket || !selectedPlaylist || !spotifyToken) return;

    socket.emit("startGame", {
      lobbyId,
      playlist: selectedPlaylist,
      spotifyToken,
    });
  };

  return {
    playlists,
    selectedPlaylist,
    setSelectedPlaylist,
    showPlaylistDialog,
    setShowPlaylistDialog,
    handleSpotifyAuth,
    handlePlaylistSelect,
    handleStartGame,
    spotifyToken,
  };
};
