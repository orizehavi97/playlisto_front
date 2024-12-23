import { useSocket } from "@/hooks/useSocket";
import { useUserId } from "@/hooks/useUserId";
import { useParams, useSearchParams } from "next/navigation";

const useLobbyMetaInfo = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const playerName = searchParams.get("name") || "";
  const isHost = searchParams.get("host") === "true";

  const userId = useUserId();
  const { socket, isConnected } = useSocket(
    (process as any).env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
  );

  return { id, playerName, isHost, userId, socket, isConnected };
};

export default useLobbyMetaInfo;
