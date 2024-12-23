import { useSocket } from "@/hooks/useSocket";
import { useUserId } from "@/hooks/useUserId";
import { useParams } from "next/navigation";

const useGameMetaInfo = () => {
  const params = useParams();
  const id = params.id as string;
  const userId = useUserId();
  const { socket, isConnected } = useSocket(
    (process as any).env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
  );

  return { id, userId, socket, isConnected };
};

export default useGameMetaInfo;
