import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";

const FIFTEEN_MINUTES_TIMEOUT = 15 * 60 * 1000;
const ONE_MINUTE_WARNING = 1 * 60 * 1000;
const CHANNEL_NAME = "idle-logout";


export const useIdleSignOut = (
  timeoutMs: number = FIFTEEN_MINUTES_TIMEOUT,
  warningMs: number = ONE_MINUTE_WARNING
) => {
  const { signOut } = useAuth();

  const channelRef = useRef<BroadcastChannel | null>(null);
  const toastId = useRef<string | null>(null);

  const logoutTimer = useRef<ReturnType<typeof setTimeout>>();
  const warningTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSignOut = () => {
    toast.remove();
    console.log("User inactive - Auto-logout.");
    signOut();
    channelRef.current?.postMessage("logout");
  };

  const resetTimers = () => {
    clearTimeout(logoutTimer.current);
    clearTimeout(warningTimer.current);

    if (toastId.current) {
      toast.dismiss(toastId.current);
      toastId.current = null;
    }

    logoutTimer.current = setTimeout(handleSignOut, timeoutMs);
    warningTimer.current = setTimeout(() => {
      toastId.current = toast("You will be logged out in 1 minute beacause of inactivity", {
        icon: "⚠️",
        duration: warningMs,

      });
    }, timeoutMs - warningMs);
  };

  useEffect(() => {
    const events = ["mousedown", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimers));
    resetTimers();

    const channel = new BroadcastChannel(CHANNEL_NAME);
    channelRef.current = channel;

    channel.onmessage = (event) => {
      if (event.data === "logout") {
        console.log("SignOut-signal received from different tab");
        signOut();
      }
    };

    return () => {
      clearTimeout(logoutTimer.current);
      clearTimeout(warningTimer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimers));
      channel.close();
    };
  }, []);
};
