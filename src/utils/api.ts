import { ChatMessage } from "../types";

export const fetchRecentMessages = async (
  setMessages: (msgs: ChatMessage[]) => void
) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/recent`);
    const data = await res.json();
    setMessages(data);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }
};
