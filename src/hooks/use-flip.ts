import { useLayoutEffect, useRef } from "react";

/**
 * Lightweight FLIP animation for list reorders.
 * Pass a stable key array in the same order as rendered children.
 * Each child must expose `data-flip-key="..."` matching one of the keys.
 */
export function useFlip<T extends HTMLElement>(keys: string[], durationMs = 350) {
  const containerRef = useRef<T | null>(null);
  const prevRects = useRef<Map<string, DOMRect>>(new Map());

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(
      container.querySelectorAll<HTMLElement>("[data-flip-key]")
    );
    const nextRects = new Map<string, DOMRect>();
    children.forEach((el) => {
      const k = el.dataset.flipKey!;
      nextRects.set(k, el.getBoundingClientRect());
    });

    children.forEach((el) => {
      const k = el.dataset.flipKey!;
      const prev = prevRects.current.get(k);
      const next = nextRects.get(k);
      if (!prev || !next) return;
      const dy = prev.top - next.top;
      if (Math.abs(dy) < 1) return;
      el.style.transition = "none";
      el.style.transform = `translateY(${dy}px)`;
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      el.getBoundingClientRect();
      el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = "";
    });

    prevRects.current = nextRects;
  }, [keys.join("|"), durationMs]);

  return containerRef;
}
