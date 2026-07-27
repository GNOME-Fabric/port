import { useEffect, useState } from "react";
import { fetchLeaderboard, type LeaderboardEntry } from "@/lib/leaderboard";

const REFRESH_MS = 60_000;

type State = {
  entries: LeaderboardEntry[];
  loading: boolean;
  nextRefresh: number; // seconds until next fetch
};

let state: State = { entries: [], loading: false, nextRefresh: 60 };
const listeners = new Set<(s: State) => void>();
let interval: number | null = null;
let tick: number | null = null;
let started = false;

function setState(patch: Partial<State>) {
  state = { ...state, ...patch };
  listeners.forEach((l) => l(state));
}

async function refresh() {
  setState({ loading: true, nextRefresh: 60 });
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
  tick = window.setInterval(() => {
    setState({ nextRefresh: state.nextRefresh <= 1 ? 60 : state.nextRefresh - 1 });
  }, 1000);
}

export function stopLeaderboardPolling() {
  if (interval != null) window.clearInterval(interval);
  if (tick != null) window.clearInterval(tick);
  interval = null;
  tick = null;
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
