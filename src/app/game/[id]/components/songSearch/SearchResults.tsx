"use client";

import { Music } from "lucide-react";

interface Song {
  id: string;
  name: string;
  artists: string[];
  album: string;
}

const SearchResults = ({
  results,
  error,
  isLoading,
  handleSubmitGuess,
  disabled,
}: {
  results: Song[];
  error: string | null;
  isLoading: boolean;
  handleSubmitGuess: (songName: string) => void;
  disabled?: boolean;
}) => (
  <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
    {error ? (
      <div className="p-2 text-sm text-destructive">{error}</div>
    ) : results.length === 0 ? (
      <div className="p-2 text-sm text-muted-foreground">
        {isLoading ? "Searching..." : "No songs found"}
      </div>
    ) : (
      <ul className="max-h-[300px] overflow-auto">
        {results.map((song) => (
          <li key={song.id} className="border-b last:border-0">
            <button
              onClick={() => handleSubmitGuess(song.name)}
              className="w-full px-4 py-2 text-left hover:bg-muted flex items-start gap-3 transition-colors"
              disabled={disabled}
            >
              <Music className="h-4 w-4 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-medium truncate">{song.name}</div>
                <div className="text-sm text-muted-foreground truncate">
                  {song.artists.join(", ")}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

export default SearchResults;
