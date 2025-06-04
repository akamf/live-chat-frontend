import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

const FIFTEEN_MINUTES_TIMEOUT = 15 * 60 * 1000;
const CHANNEL_NAME = "idle-logout";


export const useIdleSignOut = (timeoutMs: number = FIFTEEN_MINUTES_TIMEOUT) => {
  const { signOut } = useAuth();
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const channelRef = useRef<BroadcastChannel | null>(null);

  const handleSignOut = () => {
    console.log("User inactive - Auto-logout.");
    signOut();
    channelRef.current?.postMessage("logout");
  };

  const resetTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(handleSignOut, timeoutMs);
  };

  useEffect(() => {
    const events = ["mousedown", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data === "logout") {
        console.log("SignOut-signal received from different tab");
        signOut();
      }
    };

    return () => {
      clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      channel.close();
    };
  }, []);
};
