import { useEffect, useRef, useState } from "react";

const useSpotifyPlayer = (showControls: boolean, spotifyToken: string) => {
  const [player, setPlayer] = useState<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const sdkReady = useRef<boolean>(false);
  const initializationTimeout = useRef<NodeJS.Timeout | null>(null);

  // Initialize Spotify SDK script
  useEffect(() => {
    if (!showControls || !spotifyToken) return;

    // Check if script is already loaded
    if (!window.Spotify && !document.getElementById("spotify-player")) {
      const script = document.createElement("script");
      script.id = "spotify-player";
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      // Add load error handling
      script.onerror = () => {
        setError("Failed to load Spotify player");
        setIsLoading(false);
      };

      document.body.appendChild(script);
    }

    // Set timeout for SDK initialization
    initializationTimeout.current = setTimeout(() => {
      if (!sdkReady.current) {
        setError(
          "Failed to initialize Spotify player. Please refresh the page."
        );
        setIsLoading(false);
      }
    }, 15000); // Increased to 15 seconds

    return () => {
      if (initializationTimeout.current) {
        clearTimeout(initializationTimeout.current);
      }
    };
  }, [showControls, spotifyToken]);

  // Initialize Player when SDK is ready
  useEffect(() => {
    if (!showControls || !spotifyToken || sdkReady.current) return;

    const initializePlayer = () => {
      const player = new window.Spotify.Player({
        name: "Playlisto Game Player",
        getOAuthToken: (cb) => {
          cb(spotifyToken);
        },
      });

      player.addListener("ready", ({ device_id }) => {
        sdkReady.current = true;
        setDeviceId(device_id);
        setIsLoading(false);
        if (initializationTimeout.current) {
          clearTimeout(initializationTimeout.current);
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        setDeviceId(null);
      });

      player.addListener("initialization_error", ({ message }) => {
        setError(`Initialization failed: ${message}`);
        setIsLoading(false);
      });

      player.addListener("authentication_error", ({ message }) => {
        setError("Authentication failed");
        setIsLoading(false);
      });

      player.addListener("account_error", ({ message }) => {
        setError("Premium account required");
        setIsLoading(false);
      });

      player.addListener("player_state_changed", (state) => {
        if (state) {
          setIsPlaying(!state.paused);
        }
      });

      player.connect().then((success) => {
        if (!success) {
          setError("Failed to connect player");
          setIsLoading(false);
        }
      });

      setPlayer(player);
    };

    if (window.Spotify) {
      initializePlayer();
    } else {
      window.onSpotifyWebPlaybackSDKReady = initializePlayer;
    }

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, [showControls, spotifyToken]);

  if (error) console.error(error);

  return { player, deviceId, isPlaying, setIsPlaying, isLoading, error };
};

export default useSpotifyPlayer;
