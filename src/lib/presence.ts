import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { getIdentity } from "@/lib/leaderboard";
import { getSessionSeconds } from "@/hooks/use-session-recorder";

export type LivePresence = { alias: string; seconds: number };

const TRACK_MS_ACTIVE = 2_000;
const TRACK_MS_HIDDEN = 10_000;
const CHANNEL_NAME = "leaderboard-live";

let channel: RealtimeChannel | null = null;
let started = false;
let liveMap: Record<string, LivePresence> = {};
let trackInterval: number | null = null;

const listeners = new Set<(m: Record<string, LivePresence>) => void>();

function emit() {
  listeners.forEach((l) => l(liveMap));
}

function parseState(state: Record<string, Array<{ alias?: string; seconds?: number }>>) {
  const next: Record<string, LivePresence> = {};
  for (const key of Object.keys(state)) {
    const meta = state[key]?.[0];
    if (meta && typeof meta.seconds === "number") {
      next[key] = { alias: meta.alias || key, seconds: meta.seconds };
    }
  }
  liveMap = next;
  emit();
}

export async function startPresence() {
  if (started || typeof window === "undefined") return;
  started = true;

  let id: { alias: string; secret: string };
  try {
    id = await getIdentity();
  } catch {
    started = false;
    return;
  }

  const ch = supabase.channel(CHANNEL_NAME, {
    config: { presence: { key: id.alias } },
  });
  channel = ch;

  ch.on("presence", { event: "sync" }, () => {
    parseState(ch.presenceState() as Record<string, Array<{ alias?: string; seconds?: number }>>);
  });

  ch.subscribe(async (status) => {
    if (status !== "SUBSCRIBED") return;
    const push = () => {
      ch.track({ alias: id.alias, seconds: getSessionSeconds() }).catch(() => {});
    };
    const schedule = () => {
      if (trackInterval != null) window.clearInterval(trackInterval);
      const ms = document.hidden ? TRACK_MS_HIDDEN : TRACK_MS_ACTIVE;
      trackInterval = window.setInterval(push, ms);
    };
    push();
    schedule();
    document.addEventListener("visibilitychange", () => {
      push();
      schedule();
    });
  });
}

export function stopPresence() {
  if (trackInterval != null) window.clearInterval(trackInterval);
  trackInterval = null;
  if (channel) supabase.removeChannel(channel);
  channel = null;
  started = false;
  liveMap = {};
  emit();
}

export function useLivePresence() {
  const [snap, setSnap] = useState(liveMap);
  useEffect(() => {
    listeners.add(setSnap);
    setSnap(liveMap);
    return () => {
      listeners.delete(setSnap);
    };
  }, []);
  return snap;
}
