import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "types";
import { useChatConnection } from "@hooks/useChatConnection";
import { fetchRecentMessages } from "@utils/api";
import { UserResource } from "@clerk/types";
import ChatBubble from "./ChatBubble";
import { useNavigate } from "@tanstack/react-router";

interface ChatProps {
  user: UserResource | null | undefined;
  roomId: string;
  textSize: "small" | "medium" | "large";
}

const Chat = ({ user, roomId, textSize }: ChatProps) => {
  const [sender, setSender] = useState("Anonymous");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useChatConnection(roomId, user, setMessages);

  const textSizeClass =
    textSize === "small"
      ? "text-sm"
      : textSize === "large"
      ? "text-lg"
      : "text-base";

  useEffect(() => {
    if (user) {
      setSender(user.fullName || user.username || "Anonymous");
    }
  }, [user]);

  useEffect(() => {
    fetchRecentMessages(setMessages, roomId);
  }, [roomId]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleTyping = (value: string) => {
    setInput(value);
    if (!stompClient || !stompClient.connected) return;

    stompClient.publish({
      destination: "/app/typing",
      body: JSON.stringify({
        roomId,
        userId: user?.id,
        username: user?.fullName || user?.username || "Anonymous",
        typing: true,
      }),
    });
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const message: ChatMessage = {
      sender,
      senderId: user?.id || "",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };
    
    stompClient?.publish({
      destination: `/app/chat`,
      body: JSON.stringify({ ...message, roomId, userId: user?.id }),
    });

    setInput("");
  };

  return (
    <div className="w-full min-w-[20rem] md:min-w-[25rem] max-w-[75%] mx-auto p-4 sm:p-6 md:p-8 space-y-4">
      <div className={`text-start h-80 md:h-[32rem] overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100 ${textSizeClass}`}>
        {messages
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
          .map((msg, idx) => {
            const isOwnMessage = msg.senderId === user?.id;
            return (
              <ChatBubble
                key={idx}
                sender={msg.sender}
                content={msg.content}
                timestamp={msg.timestamp}
                isOwnMessage={isOwnMessage}
                index={idx}
              />
            );
          })}
        <div ref={messageEndRef} />
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <button
          onClick={() => navigate({ to: "/chat" })}
          className="sm:w-auto w-full px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded"
        >
          ⬅ Back
        </button>
        <input
          value={input}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="sm:w-auto w-full px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
