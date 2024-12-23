"use client";

import { Button } from "@/components/ui/button";
import { FaSpotify } from "react-icons/fa";
import { useSpotifyAuth } from "@/hooks/useSpotifyAuth";
import { useSpotifyConfig } from "@/hooks/useSpotifyConfig";

interface SpotifyAuthProps {
  onSuccess: (accessToken: string) => void;
}

export function SpotifyAuth({ onSuccess }: SpotifyAuthProps) {
  const { clientId } = useSpotifyConfig();
  const { redirectUri, error, handleLogin } = useSpotifyAuth(
    clientId,
    onSuccess
  );

  return (
    <div className="space-y-2">
      <Button
        onClick={handleLogin}
        className="w-full flex items-center gap-2"
        disabled={!redirectUri || !clientId}
      >
        <FaSpotify className="h-5 w-5" />
        Connect Spotify Account
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
