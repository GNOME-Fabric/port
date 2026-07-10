import { useEffect, useRef } from "react";
import { getAnyVideoModalOpen, subscribeVideoModal } from "@/lib/modal-state";

/**
 * Film-scan particle field: small mint/white specks plus a few faint vertical
 * scratches. Intentionally simple and higher contrast than the previous pass.
 */
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const DPR = Math.min(window.devicePixelRatio || 1, 2);

    let width = 0;
    let height = 0;
    let raf = 0;
    let running = true;
    let paused = getAnyVideoModalOpen();
    let last = performance.now();

    const pointer = { x: -9999, y: -9999, active: false };

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; tint: number };
    type Scratch = { x: number; y: number; h: number; speed: number; a: number };
    let particles: P[] = [];
    let scratches: Scratch[] = [];

    const density = prefersReduced ? 0 : 0.00022;
    const maxParticles = 220;

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
        vx: (Math.random() - 0.5) * 0.045,
        vy: 0.08 + Math.random() * 0.18,
        r: Math.random() > 0.86 ? 1.45 : 0.75 + Math.random() * 0.55,
        a: 0.34 + Math.random() * 0.28,
        tint: Math.random(),
      }));
      scratches = new Array(Math.max(4, Math.floor(width / 340))).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        h: 80 + Math.random() * 220,
        speed: 0.06 + Math.random() * 0.12,
        a: 0.05 + Math.random() * 0.05,
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

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.globalCompositeOperation = "screen";

      for (const s of scratches) {
        const gradient = ctx.createLinearGradient(s.x, s.y, s.x, s.y + s.h);
        gradient.addColorStop(0, `rgba(115, 255, 184, 0)`);
        gradient.addColorStop(0.5, `rgba(115, 255, 184, ${s.a})`);
        gradient.addColorStop(1, `rgba(115, 255, 184, 0)`);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x, s.y + s.h);
        ctx.stroke();
      }

      for (const p of particles) {
        ctx.fillStyle =
          p.tint > 0.58
            ? `rgba(115, 255, 184, ${p.a})`
            : `rgba(245, 255, 250, ${p.a * 0.72})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    const tick = (now: number) => {
      if (!running || paused) return;
      const delta = Math.min(32, now - last);
      last = now;
      const step = delta / 16.67;

      const R = 145;

      for (const p of particles) {
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < R) {
            const force = (1 - d / R) * 0.06;
            p.vx += (dx / (d || 1)) * force;
            p.vy += (dy / (d || 1)) * force;
          }
        }

        p.x += p.vx * step;
        p.y += p.vy * step;
        p.vx *= 0.985;
        p.vy = p.vy * 0.992 + 0.003;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;
      }

      for (const s of scratches) {
        s.y += s.speed * step;
        if (s.y > height + 40) {
          s.x = Math.random() * width;
          s.y = -s.h - Math.random() * 160;
        }
      }

      drawFrame();

      raf = requestAnimationFrame(tick);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    const unsub = subscribeVideoModal((open) => {
      paused = open;
      if (!paused && running && !prefersReduced) {
        last = performance.now();
        ctx.clearRect(0, 0, width, height);
        raf = requestAnimationFrame(tick);
      } else if (paused) {
        ctx.clearRect(0, 0, width, height);
      }
    });

    if (!prefersReduced && !paused) {
      drawFrame();
      raf = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
      unsub();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 2, opacity: 0.9 }}
    />
  );
}
