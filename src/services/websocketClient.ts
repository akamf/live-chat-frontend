import { Client  } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const SOCKET_URI = import.meta.env.VITE_SOCKET_URI;

export const stompClient = new Client({
  webSocketFactory: () => new SockJS(SOCKET_URI),
  reconnectDelay: 5000,
  connectHeaders: {
    "room-id": "1", // TODO: Update dynamically
  },
  onConnect: () => console.log("WebSocket connected"),
  onDisconnect: () => console.log("WebSocket discconnected"),
  onStompError: (err) => console.error("Error: ", err)
});
