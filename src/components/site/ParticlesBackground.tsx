import { useEffect, useRef } from "react";
import { getAnyVideoModalOpen, subscribeVideoModal } from "@/lib/modal-state";

/**
 * Subtle particle field inspired by "messy particles" + starfield.
 * - Slow drifting particles with a bit of natural jitter
 * - Mouse repulses nearby particles, and they keep momentum (inertia + friction)
 * - Very subtle: small radius, low opacity, no glow
 */
export function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      a: number;
    };
    let particles: P[] = [];

    const mouse = { x: -9999, y: -9999, active: false };
    const REPULSE = 130; // px
    const FORCE = 0.35; // repulse strength
    const FRICTION = 0.965; // inertia decay
    const DRIFT = 0.015; // ambient jitter

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = width + "px";
      canvas!.style.height = height + "px";
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      // density based on area, capped
      const target = Math.min(110, Math.floor((width * height) / 22000));
      if (particles.length === 0) {
        particles = new Array(target).fill(0).map(() => spawn());
      } else if (particles.length < target) {
        while (particles.length < target) particles.push(spawn());
      } else if (particles.length > target) {
        particles.length = target;
      }
    }

    function spawn(): P {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        r: 0.6 + Math.random() * 1.1,
        a: 0.12 + Math.random() * 0.28,
      };
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    }
    function onTouch(e: TouchEvent) {
      if (e.touches[0]) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
      }
    }

    let rafId = 0;
    let paused = getAnyVideoModalOpen();
    const unsub = subscribeVideoModal((open) => {
      paused = open;
    });

    function frame() {
      rafId = requestAnimationFrame(frame);
      if (paused) {
        ctx!.clearRect(0, 0, width, height);
        return;
      }
      ctx!.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // mouse repulse
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          const R2 = REPULSE * REPULSE;
          if (d2 < R2 && d2 > 0.0001) {
            const d = Math.sqrt(d2);
            const f = (1 - d / REPULSE) * FORCE;
            p.vx += (dx / d) * f;
            p.vy += (dy / d) * f;
          }
        }

        // ambient drift (very small)
        p.vx += (Math.random() - 0.5) * DRIFT;
        p.vy += (Math.random() - 0.5) * DRIFT;

        // inertia
        p.vx *= FRICTION;
        p.vy *= FRICTION;

        p.x += p.vx;
        p.y += p.vy;

        // wrap around edges softly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        ctx!.beginPath();
        ctx!.fillStyle = `rgba(255,255,255,${p.a})`;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    resize();
    frame();

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onLeave);

    return () => {
      cancelAnimationFrame(rafId);
      unsub();
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 w-full h-full"
      style={{ zIndex: 1, opacity: 0.85 }}
    />
  );
}

export default ParticlesBackground;
