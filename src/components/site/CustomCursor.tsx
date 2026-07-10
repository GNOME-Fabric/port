import { useEffect, useRef, useState } from "react";

/**
 * Editorial viewfinder cursor — a small mint dot with a ticked reticle ring,
 * inspired by camera focus overlays. Expands on interactive elements.
 * Hidden on touch devices; falls back to native cursor.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Skip on touch / coarse pointer devices
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const tick = () => {
      // Ease the ring toward the pointer for a subtle lag
      rx += (mx - rx) * 0.22;
      ry += (my - ry) * 0.22;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) setVisible(true);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest('a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]'));
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    document.addEventListener("pointerenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("pointerenter", onEnter);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [visible]);

  if (!enabled) return null;

  return (
    <>
      {/* Center dot */}
      <div
        ref={dotRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9999] will-change-transform"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 180ms" }}
      >
        <div
          className="rounded-full bg-accent"
          style={{
            width: pressed ? 4 : 6,
            height: pressed ? 4 : 6,
            boxShadow: "0 0 12px color-mix(in oklab, var(--accent-color) 80%, transparent)",
            transition: "width 140ms, height 140ms",
          }}
        />
      </div>

      {/* Reticle ring with tick marks */}
      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[9998] will-change-transform"
        style={{ opacity: visible ? 1 : 0, transition: "opacity 180ms" }}
      >
        <svg
          width={hover ? 56 : 34}
          height={hover ? 56 : 34}
          viewBox="0 0 56 56"
          style={{
            transition: "width 220ms cubic-bezier(0.19,1,0.22,1), height 220ms cubic-bezier(0.19,1,0.22,1)",
            filter: "drop-shadow(0 0 6px color-mix(in oklab, var(--accent-color) 45%, transparent))",
          }}
        >
          <circle
            cx="28"
            cy="28"
            r="22"
            fill="none"
            stroke="var(--accent-color)"
            strokeOpacity={hover ? 0.95 : 0.55}
            strokeWidth={hover ? 1.4 : 1}
          />
          {/* Tick marks at N/S/E/W */}
          <g stroke="var(--accent-color)" strokeWidth="1" strokeOpacity={hover ? 0.9 : 0.6}>
            <line x1="28" y1="1" x2="28" y2="6" />
            <line x1="28" y1="50" x2="28" y2="55" />
            <line x1="1" y1="28" x2="6" y2="28" />
            <line x1="50" y1="28" x2="55" y2="28" />
          </g>
        </svg>
      </div>
    </>
  );
}
