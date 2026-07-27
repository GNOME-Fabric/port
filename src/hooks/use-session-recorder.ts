import { useEffect, useRef } from "react";
import { recordSession, recordSessionBeacon } from "@/lib/leaderboard";

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
      if (secs - lastSent.current < 5) return;
      lastSent.current = secs;
      recordSession(secs).catch(() => {});
    };

    // Frequent-but-cheap: every 10s captures near-exact times without
    // hammering the RPC. Combined with the beacon below, the final value
    // stored is at most ~1 second behind reality.
    const interval = window.setInterval(send, 10_000);

    const onHide = () => {
      const secs = getSessionSeconds();
      lastSent.current = secs;
      // keepalive fetch survives unload; normal RPC does not.
      recordSessionBeacon(secs);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);

    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
    };
  }, []);
}
