import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export const useChatConnection = (
  roomId: string,
  onMessageReceived: (updateFn: (prev: any[]) => any[]) => void
): Client => {
  const client = new Client({
    webSocketFactory: () => new SockJS(import.meta.env.VITE_SOCKET_URI),
    reconnectDelay: 5000,
    connectHeaders: {
      "room-id": roomId,
    },
    onConnect: () => {
      console.log("WebSocket connected to room", roomId);
      client.subscribe(`/topic/${roomId}`, (message) => {
        if (message.body) {
          onMessageReceived((prev) => [...prev, JSON.parse(message.body)]);
        }
      });
    },
    onStompError: (err) => console.error("STOMP error:", err),
  });

  return client;
};
