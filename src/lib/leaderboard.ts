import { supabase } from "@/integrations/supabase/client";

const STORAGE_KEY = "matsuo.leaderboard.identity";
const BEST_KEY = "matsuo.leaderboard.best";

type Identity = { alias: string; secret: string };

const ADJ = [
  "Silent",
  "Neon",
  "Ghost",
  "Timecode",
  "Retro",
  "Analog",
  "Chroma",
  "Vector",
  "Delta",
  "Signal",
  "Muted",
  "Aperture",
  "Grain",
  "Splice",
  "Cyan",
  "Vapor",
  "Static",
  "Frame",
  "Halo",
  "Loop",
];
const NOUN = [
  "Editor",
  "Cutter",
  "Ghost",
  "Router",
  "Signal",
  "Cursor",
  "Render",
  "Scene",
  "Layer",
  "Buffer",
  "Reel",
  "Mask",
  "Beam",
  "Node",
  "Pulse",
];

function randHex(len: number): string {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateAlias(): string {
  return `${pick(ADJ)}${pick(NOUN)}#${randHex(2).toUpperCase()}`;
}

export function getIdentity(): Identity {
  if (typeof window === "undefined") return { alias: "", secret: "" };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Identity;
      if (parsed?.alias && parsed?.secret) return parsed;
    }
  } catch {}
  const id: Identity = { alias: generateAlias(), secret: randHex(16) };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(id));
  } catch {}
  return id;
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
  const id = getIdentity();
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
