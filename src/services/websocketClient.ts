import { Client  } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const socketUrl = "http://localhost:8080/ws";  // TODO: Move to env

export const stompClient = new Client({
    webSocketFactory: () => new SockJS(socketUrl),
    reconnectDelay: 5000,
    onConnect: () => console.log("WebSocket connected"),
    onDisconnect: () => console.log("WebSocket discconnected"),
    onStompError: (err) => console.error("Error: ", err)
});
