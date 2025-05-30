import { useEffect, useRef, useState } from "react";
import { CompatClient } from "@stomp/stompjs";
import { ChatMessage } from "../types";
import { useUser } from "@clerk/clerk-react";
import { useClerkToken } from "../hooks/useClerkToken";
import { useChatConnection } from "../hooks/useChatConnection";
import { fetchRecentMessages } from "../utils/api";

const Chat = () => {
  const { user } = useUser();
  const { storeToken } = useClerkToken();
  const [sender, setSender] = useState("Anonymous");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const stompClientRef = useRef<CompatClient | null>(null);
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
      await fetchRecentMessages(setMessages);
    };
    load(); 

    const client = useChatConnection(setMessages);
    client.activate();

    stompClientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, []);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const message: ChatMessage = {
      sender,
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    stompClientRef.current?.send("/app/chat", {}, JSON.stringify(message));
    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold text-center">\ud83d\udcac Real-Time Chat</h2>

      <div className="h-80 text-start overflow-y-auto border rounded p-2 bg-white shadow-sm">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="font-semibold">{msg.sender}: </span>
            <span>{msg.content}</span>
            <div className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-green-700 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
