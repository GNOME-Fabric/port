import { useEffect, useRef } from "react";

/**
 * Ambient "dust" particle field.
 * - Slow autonomous drift with gentle noise (feels alive on its own)
 * - Pointer creates a soft push; particles keep momentum after (inertia)
 * - DPR-capped, tab-hidden pause, reduced-motion respected
 * - No connective lines — just floating motes for a premium subtle feel
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
    let t = 0;

    const pointer = { x: -9999, y: -9999, px: -9999, py: -9999, active: false };

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      baseA: number;
      a: number;
      hue: 0 | 1; // 0 = mint accent, 1 = bright
      phase: number;
      driftX: number;
      driftY: number;
    };
    let particles: P[] = [];

    const density = prefersReduced ? 0 : 0.00016;
    const maxParticles = 160;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.floor(width * DPR);
      canvas.height = Math.floor(height * DPR);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const count = Math.min(maxParticles, Math.floor(width * height * density));
      particles = new Array(count).fill(0).map(() => {
        const r = Math.random() * 2.2 + 0.6;
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.05,
          vy: (Math.random() - 0.5) * 0.05,
          r,
          baseA: 0.45 + Math.random() * 0.45,
          a: 0,
          hue: Math.random() < 0.75 ? 0 : 1,
          phase: Math.random() * Math.PI * 2,
          driftX: (Math.random() - 0.5) * 0.02,
          driftY: (Math.random() - 0.5) * 0.02,
        };
      });
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
      t += 0.008;

      // trailing pointer velocity for smoother push
      const pvx = pointer.x - pointer.px;
      const pvy = pointer.y - pointer.py;
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const R = 130; // interaction radius
      const R2 = R * R;

      for (const p of particles) {
        // gentle autonomous drift (pseudo-noise via sin)
        p.vx += Math.sin(t * 0.7 + p.phase) * 0.0025 + p.driftX * 0.02;
        p.vy += Math.cos(t * 0.6 + p.phase * 1.3) * 0.0025 + p.driftY * 0.02;

        // pointer push — imparts velocity, then friction preserves inertia
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const d = Math.sqrt(d2) + 0.01;
            const f = (1 - d / R) * 0.35;
            p.vx += (dx / d) * f + pvx * 0.004 * (1 - d / R);
            p.vy += (dy / d) * f + pvy * 0.004 * (1 - d / R);
          }
        }

        // integrate
        p.x += p.vx;
        p.y += p.vy;

        // soft friction (keeps inertia — decays slowly)
        p.vx *= 0.965;
        p.vy *= 0.965;

        // velocity cap
        const vmag = p.vx * p.vx + p.vy * p.vy;
        if (vmag > 9) {
          const s = 3 / Math.sqrt(vmag);
          p.vx *= s;
          p.vy *= s;
        }

        // wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // twinkle
        const twinkle = 0.75 + Math.sin(t * 2 + p.phase) * 0.25;
        p.a = p.baseA * twinkle;

        // glow — layered radial
        const color = p.hue === 0 ? "115, 255, 184" : "45, 212, 168";
        const glowR = p.r * 6;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR);
        g.addColorStop(0, `rgba(${color}, ${p.a * 0.9})`);
        g.addColorStop(0.4, `rgba(${color}, ${p.a * 0.25})`);
        g.addColorStop(1, `rgba(${color}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2);
        ctx.fill();

        // core
        ctx.fillStyle = `rgba(${color}, ${Math.min(1, p.a * 1.4)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
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
    <>
      {/* Ambient glow wash — sits behind content */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div
          className="absolute -top-1/3 left-1/2 -translate-x-1/2 w-[1400px] h-[1400px] rounded-full opacity-[0.10] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--accent-color) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute bottom-[-20%] left-[-10%] w-[900px] h-[900px] rounded-full opacity-[0.06] blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--bright) 0%, transparent 65%)",
          }}
        />
      </div>
      {/* Dust canvas — floats above content but never intercepts input */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 w-full h-full z-[60]"
      />
    </>
  );
}
