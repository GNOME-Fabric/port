import { useEffect, useState } from "react";

// Global count of open fullscreen video modals. Consumers can pause heavy work
// (particle canvas, background YT iframes) while any modal is playing to keep
// the active video smooth.
let count = 0;
const listeners = new Set<(n: number) => void>();

function emit() {
  for (const l of listeners) l(count);
}

export function openVideoModal() {
  count += 1;
  emit();
}

export function closeVideoModal() {
  count = Math.max(0, count - 1);
  emit();
}

export function useAnyVideoModalOpen() {
  const [n, setN] = useState(count);
  useEffect(() => {
    listeners.add(setN);
    return () => {
      listeners.delete(setN);
    };
  }, []);
  return n > 0;
}

export function getAnyVideoModalOpen() {
  return count > 0;
}

export function subscribeVideoModal(cb: (open: boolean) => void) {
  const wrapped = (n: number) => cb(n > 0);
  listeners.add(wrapped);
  return () => {
    listeners.delete(wrapped);
  };
}
