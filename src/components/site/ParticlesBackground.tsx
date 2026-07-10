import { useEffect, useRef } from "react";
import { getAnyVideoModalOpen, subscribeVideoModal } from "@/lib/modal-state";

/**
 * Subtle ambient dust field — sits behind the content, low opacity, small dots.
 * Autonomous drift + soft pointer push with inertia. No heavy glow.
 */
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 1.5);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let paused = getAnyVideoModalOpen();
    let t = 0;

    const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, active: false };

    type P = {
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      baseA: number;
      a: number;
      phase: number;
      driftX: number; driftY: number;
    };
    let particles: P[] = [];

    const density = prefersReduced ? 0 : 0.00014;
    const maxParticles = 140;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const count = Math.min(maxParticles, Math.floor(width * height * density));
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.05,
        vy: (Math.random() - 0.5) * 0.05,
        r: Math.random() * 1.1 + 0.4,
        baseA: 0.35 + Math.random() * 0.35,
        a: 0,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.02,
        driftY: (Math.random() - 0.5) * 0.02,
      }));
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      running = !document.hidden;
      if (running) raf = requestAnimationFrame(tick);
    };

    const tick = () => {
      if (!running || paused) return;
      t += 0.008;

      const pvx = pointer.x - pointer.px;
      const pvy = pointer.y - pointer.py;
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      ctx.clearRect(0, 0, width, height);

      const R = 120;
      const R2 = R * R;

      for (const p of particles) {
        // autonomous drift
        p.vx += Math.sin(t * 0.7 + p.phase) * 0.002 + p.driftX * 0.02;
        p.vy += Math.cos(t * 0.6 + p.phase * 1.3) * 0.002 + p.driftY * 0.02;

        // soft pointer push (imparts velocity, inertia carries it)
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.01;
            const f = (1 - d / R) * 0.28;
            p.vx += (dx / d) * f + pvx * 0.003 * (1 - d / R);
            p.vy += (dy / d) * f + pvy * 0.003 * (1 - d / R);
          }
        }

        p.x += p.vx;
        p.y += p.vy;

        // friction preserves gentle inertia
        p.vx *= 0.96;
        p.vy *= 0.96;

        // wrap around viewport
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // subtle twinkle
        const twinkle = 0.7 + Math.sin(t * 1.6 + p.phase) * 0.3;
        p.a = p.baseA * twinkle;

        // small soft dot — minimal glow
        ctx.fillStyle = `rgba(120, 240, 190, ${p.a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    if (!prefersReduced) raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 1 }}
    />
  );
}
