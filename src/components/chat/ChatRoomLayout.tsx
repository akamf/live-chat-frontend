import { useUser } from "@clerk/clerk-react";
import { useState, useRef, useEffect } from "react";
import Participants from "./Participants";
import Chat from "./Chat";
import { useChatConnection } from "@hooks/useChatConnection";

interface ChatRoomProps {
  roomId: string;
}

const ChatRoomLayout = ({ roomId }: ChatRoomProps) => {
  const { user } = useUser();
  const [typingUserIds, setTypingUserIds] = useState<Record<string, boolean>>({});
  const stompClient = useChatConnection(roomId, user, () => {});
  const typingTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  const [textSize, setTextSize] = useState<"small" | "medium" | "large">("medium");

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem("settings") || "{}");
    const size = settings.textSize || "medium";
    if (["small", "medium", "large"].includes(size)) {
      setTextSize(size);
    }
  }, []);

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const subscription = stompClient.subscribe(`/topic/${roomId}/typing`, (msg) => {
      const data = JSON.parse(msg.body);
      console.log("Typing received in layout", data);

      if (!data.userId) return;

      setTypingUserIds((prev) => ({ ...prev, [data.userId]: true }));

      if (typingTimeouts.current[data.userId]) {
        clearTimeout(typingTimeouts.current[data.userId]);
      }

      typingTimeouts.current[data.userId] = setTimeout(() => {
        setTypingUserIds((prev) => ({ ...prev, [data.userId]: false }));
      }, 3000);
    });

    return () => subscription.unsubscribe();
  }, [stompClient, roomId]);

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full h-full md:max-w-[75%] items-center">
      <Participants roomId={roomId} typingUserIds={typingUserIds} textSize={textSize} />
      <Chat user={user} roomId={roomId} textSize={textSize} />
    </div>
  );
};

export default ChatRoomLayout;
