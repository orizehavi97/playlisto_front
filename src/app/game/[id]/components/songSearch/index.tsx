"use client";

import { searchSongs } from "@/api/spotify";
import { useGameContext } from "@/context/gameContext/useGameContext";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";
import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";

interface Song {
  id: string;
  name: string;
  artists: string[];
  album: string;
}

interface SongSearchProps {
  onGuess: (songName: string) => void;
  disabled?: boolean;
  hasGuessedCorrectly?: boolean;
}

function SongSearch({
  onGuess,
  disabled,
  hasGuessedCorrectly,
}: SongSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const { spotifyToken } = useGameContext();

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Search songs when debounced search term changes
  useEffect(() => {
    if (!debouncedSearchTerm.trim() || !spotifyToken) {
      setResults([]);
      return;
    }

    const fetchSongs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await searchSongs(debouncedSearchTerm, spotifyToken);
        const formattedResults = data.tracks.items.map((track: any) => ({
          id: track.id,
          name: track.name,
          artists: track.artists.map((artist: any) => artist.name),
          album: track.album.name,
        }));
        setResults(formattedResults);
        setShowResults(true);
      } catch (error) {
        console.error("Search error:", error);
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [debouncedSearchTerm, spotifyToken]);

  const handleSubmitGuess = (songName: string) => {
    onGuess(songName);
    setSearchTerm("");
    setResults([]);
    setShowResults(false);
  };

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowResults(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <SearchInput
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setShowResults={setShowResults}
        isLoading={isLoading}
        disabled={disabled || hasGuessedCorrectly}
      />
      {showResults && (searchTerm || results.length > 0) && (
        <SearchResults
          results={results}
          error={error}
          isLoading={isLoading}
          handleSubmitGuess={handleSubmitGuess}
          disabled={disabled || hasGuessedCorrectly}
        />
      )}
    </div>
  );
}

export default SongSearch;
