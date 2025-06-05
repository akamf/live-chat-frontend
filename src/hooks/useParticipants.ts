import { ChatUser } from "types";
import { useEffect, useState } from "react";
import { useClerkToken } from "./useClerkToken";

export const useParticipants = (roomId: string) => {
  const [participants, setParticipants] = useState<ChatUser[]>([]);
  const { fetchToken } = useClerkToken();

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = await fetchToken();
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-rooms/${roomId}/online`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        setParticipants(data);
      } catch (err) {
        console.error("Failed to fetch participants", err);
      }
    };

    fetchParticipants();
    const interval = setInterval(fetchParticipants, 2000);
    return () => clearInterval(interval);
  }, [roomId]);

  return participants;
};
