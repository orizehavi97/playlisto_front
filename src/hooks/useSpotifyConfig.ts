import { useEffect, useState } from "react";

export function useSpotifyConfig() {
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    const CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!CLIENT_ID) {
      console.error(
        "Missing NEXT_PUBLIC_SPOTIFY_CLIENT_ID in environment variables"
      );
    }
    setClientId(CLIENT_ID || null);
  }, []);

  return { clientId };
}
