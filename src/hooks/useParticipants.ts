import { useEffect, useState } from "react";

export const useParticipants = (roomId: string) => {
  const [participants, setParticipants] = useState<string[]>([]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/rooms/${roomId}/participants`);
        const data = await res.json();
        setParticipants(data);
      } catch (err) {
        console.error("Failed to fetch participants", err);
      }
    };

    fetchParticipants();
    const interval = setInterval(fetchParticipants, 5000); // polla var 5:e sekund
    return () => clearInterval(interval);
  }, [roomId]);

  return participants;
};
