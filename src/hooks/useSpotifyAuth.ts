import { useEffect, useState } from "react";
import { useSearchParams, usePathname } from "next/navigation";

const SPOTFY_AUTH_URL = "https://accounts.spotify.com/authorize";

export function useSpotifyAuth(
  clientId: string | null,
  onSuccess: (accessToken: string) => void
) {
  const [redirectUri, setRedirectUri] = useState("");
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const spotifyToken = searchParams.get("spotify_token");
    if (spotifyToken) {
      onSuccess(spotifyToken);
    }
  }, [searchParams, onSuccess]);

  useEffect(() => {
    const envRedirectUri = process.env.NEXT_PUBLIC_REDIRECT_URI;
    setRedirectUri(
      envRedirectUri || `${window.location.origin}/spotify-callback`
    );
  }, []);

  const handleLogin = () => {
    if (!redirectUri) {
      setError("Redirect URI not set");
      return;
    }

    if (!clientId) {
      setError("Spotify Client ID not configured");
      return;
    }

    try {
      const authUrl = new URL(SPOTFY_AUTH_URL);
      const state = JSON.stringify({
        returnPath: pathname + window.location.search,
      });
      const encodedState = btoa(state);

      const params = {
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: process.env.SPOTIFY_CLIENT_SECRET,
        response_type: "token",
        redirect_uri: redirectUri,
        scope: [
          "playlist-read-private",
          "playlist-read-collaborative",
          "user-read-private",
          "user-read-email",
          "streaming",
          "user-read-playback-state",
          "user-modify-playback-state",
          "app-remote-control",
        ].join(" "),
        state: encodedState,
        show_dialog: "true",
      };

      Object.entries(params).forEach(([key, value]) => {
        authUrl.searchParams.append(key, value!);
      });

      window.location.href = authUrl.toString();
    } catch (err) {
      console.error("Error during Spotify auth:", err);
      setError("Failed to initiate Spotify login");
    }
  };

  return { redirectUri, error, handleLogin };
}
