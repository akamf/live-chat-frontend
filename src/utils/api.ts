import { ChatMessage } from "../types";

export async function fetchRecentMessages(
  setMessages: (msgs: ChatMessage[]) => void,
  roomId: string
) {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/${roomId}`);
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    setMessages(data);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }
};

export const fetchOnlineUsers = async (): Promise<Record<string, number>> => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-rooms/online`);
  if (!res.ok) throw new Error("Failed to fetch online users");
  return res.json();
};
