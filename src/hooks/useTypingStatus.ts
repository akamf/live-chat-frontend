import { useEffect, useRef } from "react";
import { CompatClient } from "@stomp/stompjs";
import { UserResource } from "@clerk/types";

export const useTypingStatus = (
  stompClient: CompatClient | null,
  roomId: string,
  user: UserResource | null,
  inputValue: string
) => {
  const lastSentRef = useRef<number>(0);

  useEffect(() => {
    const now = Date.now();
    if (
      stompClient &&
      stompClient.connected &&
      user &&
      inputValue.length > 0 &&
      now - lastSentRef.current > 1000
    ) {
      stompClient.publish({
        destination: "/app/typing",
        body: JSON.stringify({
          userId: user.id,
          username: user.fullName || user.username || "Anonymous",
          roomId,
          typing: true,
        }),
      });
      lastSentRef.current = now;
    }
  }, [inputValue, roomId, user, stompClient]);
};
