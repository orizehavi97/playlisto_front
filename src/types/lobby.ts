export interface Player {
  id: string;
  userId?: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

export interface Playlist {
  id: string;
  name: string;
  tracks: number | { items: any[] };
  imageUrl?: string;
}
