import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";

export const useChatConnection = (
  roomId: string,
  onMessageReceived: (updateFn: (prev: any[]) => any[]) => void
): Client | null => {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_SOCKET_URI}?room-id=${roomId}`), 
      reconnectDelay: 5000,
      connectHeaders: {
        "room-id": roomId,
      },
      onConnect: () => {
        console.log("✅ WebSocket connected to room", roomId);
        client.subscribe(`/topic/${roomId}`, (message) => {
          if (message.body) {
            console.log("📨 Incoming message:", message.body);
            onMessageReceived((prev) => [...prev, JSON.parse(message.body)]);
          }
        });
      },
      onStompError: (err) => console.error("❌ STOMP error:", err),
    });

    client.activate();
    clientRef.current = client;

    return () => {
      client.deactivate();
    };
  }, [roomId]);

  return clientRef.current;
};
