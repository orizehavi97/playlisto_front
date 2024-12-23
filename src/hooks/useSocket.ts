import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useUserId } from "./useUserId";

export function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const userId = useUserId();

  useEffect(() => {
    // Create socket with auth
    const newSocket = io(url, {
      auth: { userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [url, userId]);

  return { socket, isConnected };
}
