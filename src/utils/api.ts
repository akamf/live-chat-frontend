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
  const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-rooms/online-counts`);
  if (!res.ok) throw new Error("Failed to fetch online users");
  return res.json(); // { "1": 3, "2": 5, ... }
};

export const login = async (user: any) => {
  await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      name: user.fullName,
      email: user.primaryEmailAddress?.emailAddress,
    }),
  });
};

export const fetchPublicChatRooms = async () => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-rooms/public`);
  if (!res.ok) throw new Error("Failed to fetch chat rooms");
  return res.json();
};
