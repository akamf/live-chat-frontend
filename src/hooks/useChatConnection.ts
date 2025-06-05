import { Client } from "@stomp/stompjs";
import { useEffect, useRef } from "react";
import SockJS from "sockjs-client";
import { useClerkToken } from "./useClerkToken";

export const useChatConnection = (
  roomId: string,
  user: any | null,
  onMessageReceived: (updateFn: (prev: any[]) => any[]) => void
): Client | null => {
  const clientRef = useRef<Client | null>(null);
  const { fetchToken } = useClerkToken();

  useEffect(() => {
    if (!roomId) return;

    let isCancelled = false;

    const setupClient = async () => {
      const token = await fetchToken();

      if (clientRef.current) {
        clientRef.current.deactivate();
      }

      const client = new Client({
        webSocketFactory: () =>
          new SockJS(`${import.meta.env.VITE_SOCKET_URL}?token=${token}&room-id=${roomId}`),
        reconnectDelay: 5000,
        connectHeaders: {
          "room-id": roomId,
          "user-id": user?.id || "anonymous",
        },
        onConnect: () => {
          console.log("✅ WebSocket connected to room", roomId);
          if (!isCancelled) {
            client.subscribe(`/topic/${roomId}`, (message) => {
              if (message.body) {
                console.log("📨 Incoming message:", message.body);
                onMessageReceived((prev) => [...prev, JSON.parse(message.body)]);
              }
            });
          }
        },
        onStompError: (err) => console.error("STOMP error:", err),
      });

      client.activate();
      clientRef.current = client;
    };

    setupClient();

    return () => {
      isCancelled = true;
      clientRef.current?.deactivate();
    };
  }, [roomId]);

  return clientRef.current;
};
