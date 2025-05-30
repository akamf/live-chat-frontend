import { CompatClient, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export function useChatConnection(onMessageReceived: (msg: any) => void): CompatClient {
  const socket = new SockJS(import.meta.env.VITE_SOCKET_URI);
  const stompClient = Stomp.over(socket);

  stompClient.connect({}, () => {
    stompClient.subscribe("/topic/chat", (message) => {
      if (message.body) {
        onMessageReceived((prev: any[]) => [...prev, JSON.parse(message.body)]);
      }
    });
  });

  return stompClient;
}