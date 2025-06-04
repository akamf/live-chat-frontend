import { useEffect, useRef, useState } from "react";
import { ChatMessage } from "types";
import { useChatConnection } from "@hooks/useChatConnection";
import { fetchRecentMessages } from "@utils/api";
import { formatDate, isValidDate } from "@utils/date";
import { UserResource } from "@clerk/types";
import ChatBubble from "./ChatBubble";

interface ChatProps {
  user: UserResource | null | undefined;
  roomId: string;
};

const Chat = ({ user, roomId }: ChatProps) => {
  const [sender, setSender] = useState("Anonymous");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState<string | null>(null);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const stompClient = useChatConnection(roomId, user, setMessages);

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

  useEffect(() => {
    if (!stompClient || !stompClient.connected) return;

    const subscription = stompClient.subscribe(
      `/topic/${roomId}/typing`,
      (msg) => {
        const data = JSON.parse(msg.body);
        if (data.typing && data.userId !== user?.id) {
          setIsTyping(`${data.username} is typing...`);
          setTimeout(() => setIsTyping(null), 3000);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [stompClient, roomId, user]);

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
    <>
      <div className="w-full min-w-[20rem] md:min-w-[25rem] max-w-[75%] mx-auto p-4 sm:p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-bold text-center dark:text-white">💬 Real-Time Chat</h2>

        <div className="text-start h-80 md:h-[32rem] overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100">
          {isTyping && (
            <p className="text-sm italic text-gray-500 dark:text-gray-400">
              {isTyping}
            </p>
          )}

          {messages
            .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
            .map((msg, idx) => {
              const isOwnMessage = msg.sender === sender;

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

        {user && (
          <p className="text-start text-sm text-gray-600 dark:text-gray-400 mb-2">
            Logged in as <span className="font-semibold">{user.fullName || user.username}</span>
          </p>
        )}

        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-600"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-green-700 hover:bg-green-800 text-white rounded"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
};

export default Chat;
