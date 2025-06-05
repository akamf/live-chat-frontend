import { Clerk } from "@clerk/clerk-js";
import { ChatMessage } from "types";

const getClerkToken = async (): Promise<string | null> => {
  try {
    if (!window.Clerk) {
      throw new Error("Clerk not loaded");
    }

    const session = window.Clerk.session;
    if (!session) {
      console.warn("No active Clerk session");
      return null;
    }

    return await session.getToken({ template: "Login-User-JWT" });
  } catch (err) {
    console.error("Failed to get Clerk token:", err);
    return null;
  }
};

export async function fetchRecentMessages(
  setMessages: (msgs: ChatMessage[]) => void,
  roomId: string
) {
  try {
    const token = await getClerkToken();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/messages/${roomId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) throw new Error("Failed to fetch messages");
    const data = await res.json();
    setMessages(data);
  } catch (err) {
    console.error("Failed to fetch messages:", err);
  }
};

export const fetchOnlineUsers = async (): Promise<Record<string, number>> => {
  const token = await getClerkToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-rooms/online-counts`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch online users");
  return res.json();
};

export const login = async (user: any): Promise<boolean> => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify({
        userId: user.id,
        name: user.fullName,
        email: user.primaryEmailAddress?.emailAddress,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend login failed", res.status, errText);
      throw new Error("Backend login failed");
    }
    return true;
  } catch (err) {
    console.error("Backend login error:", err);
    return false;
  }
};

export const fetchPublicChatRooms = async () => {
  const token = await getClerkToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/chat-rooms/public`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch chat rooms");
  return res.json();
};

export const logout = async (userId: string): Promise<boolean> => {
  try {
    const token = await getClerkToken();
    if (!token) throw new Error("No token found");

    const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Backend logout failed", res.status, errText);
      throw new Error("Backend logout failed");
    }

    localStorage.removeItem("user"); // Om du sparar användardata

    return true;
  } catch (err) {
    console.error("Backend logout error:", err);
    return false;
  }
};

export const fetchUserSettings = async (): Promise<{ textSize: string; darkMode: string }> => {
  const token = await getClerkToken();
  const res = await fetch(`${import.meta.env.VITE_API_URL}/user/settings`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  if (!res.ok) throw new Error("Failed to fetch user settings");
  return res.json();
};