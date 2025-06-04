import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";

export const useIdleSignOut = (timeoutMs: number = (15 * 60 * 1000)) => {
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const { signOut } = useAuth();

  const resetTimer = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      console.log("User inactive - Auto-logout.");
      signOut();
    }, timeoutMs);
  };

  useEffect(() => {
    const events = ["mousedown", "keydown", "click", "scroll"];
    events.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      clearTimeout(timer.current);
      events.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, []);
};
