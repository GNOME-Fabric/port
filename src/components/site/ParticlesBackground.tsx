import { useEffect, useRef } from "react";

/**
 * Lightweight reactive particle background.
 * - Canvas 2D with capped particle count and DPR
 * - Pauses when tab hidden or user prefers reduced motion
 * - Subtly reacts to pointer movement
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

    const pointer = { x: -9999, y: -9999, active: false };

    type P = { x: number; y: number; vx: number; vy: number; r: number; a: number };
    let particles: P[] = [];

    const density = prefersReduced ? 0 : 0.00006; // particles per px
    const maxParticles = 70;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const count = Math.min(maxParticles, Math.floor(width * height * density));
      particles = new Array(count).fill(0).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: Math.random() * 1.2 + 0.3,
        a: Math.random() * 0.4 + 0.2,
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
      if (!running) return;
      ctx.clearRect(0, 0, width, height);

      // Draw particles
      for (const p of particles) {
        // pointer influence
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14400) {
            const f = (1 - d2 / 14400) * 0.02;
            p.vx += (dx / Math.sqrt(d2 + 0.01)) * f;
            p.vy += (dy / Math.sqrt(d2 + 0.01)) * f;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.985;
        p.vy *= 0.985;

        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(115, 255, 184, ${p.a})`;
        ctx.fill();
      }

      // Connective lines (subtle)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 11000) {
            const alpha = (1 - d2 / 11000) * 0.06;
            ctx.strokeStyle = `rgba(45, 212, 168, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
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
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      {/* Soft ambient glow */}
      <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--accent-color) 0%, transparent 60%)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
}
