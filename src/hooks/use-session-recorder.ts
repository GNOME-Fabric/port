import { useEffect, useRef } from "react";
import { recordSession } from "@/lib/leaderboard";

// Module-level session start so every consumer agrees on the duration.
let sessionStart: number | null = null;

export function getSessionStart(): number {
  if (sessionStart == null) sessionStart = Date.now();
  return sessionStart;
}

export function getSessionSeconds(): number {
  return Math.floor((Date.now() - getSessionStart()) / 1000);
}

/**
 * Periodically records the current session length to the leaderboard,
 * and once more on tab hide / unload. Silent about errors — easter egg.
 */
export function useSessionRecorder() {
  const lastSent = useRef(0);

  useEffect(() => {
    getSessionStart();

    const send = () => {
      const secs = getSessionSeconds();
      if (secs - lastSent.current < 15) return;
      lastSent.current = secs;
      recordSession(secs).catch(() => {});
    };

    const interval = window.setInterval(send, 30_000);
    const onHide = () => send();
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);
}
