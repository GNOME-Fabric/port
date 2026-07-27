import { useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";

// Records are the historical "hall of fame". Live tracking is handled by
// presence.ts via WebSocket, so we only need to refresh the persisted
// records occasionally — presence covers the real-time visualization.
const REFRESH_MS = 120_000;

type State = {
  entries: LeaderboardEntry[];
  loading: boolean;
};

let state: State = { entries: [], loading: false };
const listeners = new Set<(s: State) => void>();
let interval: number | null = null;
let started = false;

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
}

async function refresh() {
  setState({ loading: true });
  try {
    const entries = await fetchLeaderboard(20);
    setState({ entries, loading: false });
  } catch {
    setState({ loading: false });
  }
}

export function startLeaderboardPolling() {
  if (started || typeof window === "undefined") return;
  started = true;
  refresh();
  interval = window.setInterval(refresh, REFRESH_MS);
}

export function stopLeaderboardPolling() {
  if (interval != null) window.clearInterval(interval);
  interval = null;
  started = false;
}

export function refreshLeaderboardNow() {
  refresh();
}

export function useLeaderboardStore(): State {
  const [snap, setSnap] = useState(state);
  useEffect(() => {
    listeners.add(setSnap);
    setSnap(state);
    return () => {
      listeners.delete(setSnap);
    };
  }, []);
  return snap;
}
