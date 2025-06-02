import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { ChatMessage } from "../types";
import { useUser } from "@clerk/clerk-react";
import { useClerkToken } from "../hooks/useClerkToken";
import { useChatConnection } from "../hooks/useChatConnection";
import { fetchRecentMessages } from "../utils/api";

interface ChatProps {
  roomId: string;
}

const Chat = ({ roomId }: ChatProps) => {
  const { user } = useUser();
  const { storeToken } = useClerkToken();
  const [sender, setSender] = useState("Anonymous");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const stompClientRef = useRef<Client | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) {
      setSender(user.fullName || user.username || "Anonymous");
    }
  }, [user]);

  useEffect(() => {
    storeToken();
  }, [storeToken]);

  useEffect(() => {
    const load = async () => {
      await fetchRecentMessages(setMessages, roomId);
    };
    load();

    const client = useChatConnection(roomId, setMessages);
    client.activate();
    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId]); 

  const handleSend = () => {
    if (!input.trim()) return;

    const message: ChatMessage = {
      sender,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    if (stompClientRef.current && stompClientRef.current.connected) {
      stompClientRef.current.publish(
        { destination: `/app/chat/${roomId}`, body: JSON.stringify(message) }
      );
      console.log("Message sent!\nMessage:", message)
    }
    setInput("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 md:p-8 space-y-4">
      <h2 className="text-2xl font-bold text-center dark:text-white">💬 Real-Time Chat</h2>

      <div className="text-start h-80 overflow-y-auto border rounded p-3 bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-3">
            <span className="font-semibold">{msg.sender}: </span>
            <span>{msg.content}</span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
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
          onChange={(e) => setInput(e.target.value)}
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
  );
};

export default Chat;
