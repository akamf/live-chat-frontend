import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { CompatClient, Stomp } from "@stomp/stompjs";
import { ChatMessage } from "../types";
import { useUser, useAuth } from "@clerk/clerk-react";


const SOCKET_URI = import.meta.env.VITE_SOCKET_URI;
const API_URL = import.meta.env.VITE_API_URL;


const Chat = () => {

  const { user } = useUser();
  const { getToken } = useAuth();
  
  useEffect(() => {
    if (user) {
      setSender(user.fullName || user.username || "Anonymous");
    }
  }, [user]);

  useEffect(() => {
    async function fetchToken() {
      const jwt = await getToken({ template: "Login-User-JWT" });
      if (jwt) {
        localStorage.setItem("token", jwt);
      }
    }
    fetchToken();
  }, [getToken]);
  

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sender, setSender] = useState("Guest");
  const stompClientRef = useRef<CompatClient | null>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    async function fetchMessages() {
      try {
        const res = await fetch(`${API_URL}/messages/recent`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    }

    const socket = new SockJS(SOCKET_URI);
    const client = Stomp.over(socket);
    client.connect({}, () => {
      client.subscribe("/topic/chat", (msg) => {
        const body = JSON.parse(msg.body) as ChatMessage;
        setMessages((prev) => [...prev, body]);
      });
    });

    stompClientRef.current = client;
    fetchMessages();

    return () => {
      client.disconnect(() => {
        console.log("Disconnected");
      });
    };
  }, []);

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim() === "") return;

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
      <h2 className="text-2xl font-bold text-center">💬 Real-Time Chat</h2>
      
      <div className="h-80 overflow-y-auto border rounded p-2 bg-white shadow-sm">
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
}

export default Chat;
