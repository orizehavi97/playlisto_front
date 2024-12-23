declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_SPOTIFY_CLIENT_ID: string;
      SPOTIFY_CLIENT_SECRET: string;
      SPOTIFY_REDIRECT_URI: string;
      NEXT_PUBLIC_SOCKET_URL: string;
      NEXT_PUBLIC_APP_URL: string;
    }
    interface Process {
      env: ProcessEnv;
    }
  }
}
