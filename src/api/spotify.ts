const SPOTFY_API_URL = "https://api.spotify.com/v1";

const apiCall = async (
  url: string,
  method: string,
  token: string,
  body?: any
) => {
  const response = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.status}`);
  }

  return response;
};

export const fetchPlaylists = async (token: string) => {
  const response = await apiCall(
    `${SPOTFY_API_URL}/me/playlists?limit=50`,
    "GET",
    token
  );
  return await response.json();
};

export const fetchPlaylistDetails = async (
  playlistId: string,
  token: string
) => {
  const response = await apiCall(
    `${SPOTFY_API_URL}/playlists/${playlistId}`,
    "GET",
    token
  );
  return await response.json();
};

export const transferPlaybackToDevice = async (
  deviceId: string,
  token: string
) => {
  await apiCall(`${SPOTFY_API_URL}/me/player`, "PUT", token, {
    device_ids: [deviceId],
    play: false,
  });
};

export const startPlayback = async (
  deviceId: string,
  songId: string,
  token: string
) => {
  await apiCall(
    `${SPOTFY_API_URL}/me/player/play?device_id=${deviceId}`,
    "PUT",
    token,
    {
      uris: [`spotify:track:${songId}`],
      position_ms: 0,
    }
  );
};

export const searchSongs = async (searchTerm: string, token: string) => {
  const response = await apiCall(
    `${SPOTFY_API_URL}/search?q=${encodeURIComponent(
      searchTerm
    )}&type=track&limit=5`,
    "GET",
    token
  );

  return await response.json();
};
