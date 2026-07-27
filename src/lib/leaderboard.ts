import { supabase } from "@/integrations/supabase/client";
import { getIpIdentity } from "@/lib/identity.functions";

const STORAGE_KEY = "matsuo.leaderboard.identity";
const BEST_KEY = "matsuo.leaderboard.best";

type Identity = { alias: string; secret: string };

let cached: Identity | null = null;
let inflight: Promise<Identity> | null = null;

export async function getIdentity(): Promise<Identity> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    try {
      const id = (await getIpIdentity()) as Identity;
      if (id?.alias && id?.secret) {
        cached = id;
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(id));
        } catch {}
        return id;
      }
    } catch {}
    // Fallback to last cached identity so a network blip doesn't break recording.
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Identity;
        if (parsed?.alias && parsed?.secret) {
          cached = parsed;
          return parsed;
        }
      }
    } catch {}
    throw new Error("identity unavailable");
  })();
  try {
    return await inflight;
  } finally {
    inflight = null;
  }
}

export function getStoredBest(): number {
  if (typeof window === "undefined") return 0;
  try {
    return parseInt(localStorage.getItem(BEST_KEY) || "0", 10) || 0;
  } catch {
    return 0;
  }
}

export function setStoredBest(seconds: number): void {
  try {
    localStorage.setItem(BEST_KEY, String(seconds));
  } catch {}
}

export async function recordSession(seconds: number): Promise<void> {
  if (seconds < 5) return; // skip micro sessions
  let id: Identity;
  try {
    id = await getIdentity();
  } catch {
    return;
  }
  await supabase.rpc("record_session", {
    _alias: id.alias,
    _secret: id.secret,
    _seconds: Math.floor(seconds),
  });
  setStoredBest(Math.max(getStoredBest(), Math.floor(seconds)));
}


export type LeaderboardEntry = {
  alias: string;
  longest_seconds: number;
  updated_at: string;
};

export async function fetchLeaderboard(limit = 20): Promise<LeaderboardEntry[]> {
  const { data, error } = await supabase.rpc("get_session_leaderboard", { _limit: limit });
  if (error) throw error;
  return (data ?? []) as LeaderboardEntry[];
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}
