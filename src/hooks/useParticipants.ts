import { ChatUser } from "types";
import { useEffect, useState } from "react";

export const useParticipants = (roomId: string) => {
  const [participants, setParticipants] = useState<ChatUser[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-rooms/${roomId}/online`);
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
