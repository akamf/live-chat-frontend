import { useEffect, useState } from "react";
import { stompClient } from "../services/websocketClient";


interface ChatMessage {
  sender: string;
  content: string;
  timestamp: string;
}

export default function App() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    stompClient.onConnect = () => {
      console.log("✅ Connected to WebSocket");

      stompClient.subscribe("/topic/chat", (message) => {
        const body = JSON.parse(message.body);
        console.log("📩 Incoming:", body);

        setMessages((prev) => [...prev, body]);
      });
    };

    stompClient.onDisconnect = () => {
      console.log("🛑 Disconnected from WebSocket");
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP error:", frame);
    };

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;

    const message: ChatMessage = {
      sender: "Andreas",
      content: input,
      timestamp: new Date().toISOString(),
    };

    stompClient.publish({
      destination: "/app/chat",
      body: JSON.stringify(message),
    });

    setInput("");
  };

  return (
    <div className="max-w-xl mx-auto p-4 font-mono">
      <h1 className="text-2xl font-bold mb-4">💬 Live Chat</h1>

      <div className="border rounded h-80 overflow-y-scroll p-2 bg-gray-100">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-1">
            <strong>{msg.sender}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex mt-4">
        <input
          className="border flex-1 px-2 py-1"
          type="text"
          placeholder="Write a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-1 ml-2 rounded"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
