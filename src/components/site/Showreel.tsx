import { useState } from "react";
import posterImg from "@/assets/showreel-poster.jpg";
import { useReveal } from "@/hooks/use-reveal";

const REEL_YT_ID = "o_SwaTpc0VQ";

export function Showreel() {
  const [open, setOpen] = useState(false);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="showreel" className="pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={ref} className="relative group">
          <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-accent/40 pointer-events-none z-10" />
          <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-accent/40 pointer-events-none z-10" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full aspect-video overflow-hidden rounded-md border border-border relative block"
            aria-label="Play showreel"
          >
            <img
              src={posterImg}
              alt="Matsuo showreel poster"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
            <span className="absolute inset-0 bg-background/30" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center py-2 pr-4 pl-4 bg-accent text-accent-foreground font-medium rounded-full transition-transform duration-500 group-hover:scale-105">
                <span className="mr-3 text-sm tracking-widest uppercase">Play Reel</span>
                <span className="text-xs tracking-tighter opacity-70 font-heading">02:14</span>
              </span>
            </span>
            <span className="absolute bottom-4 left-4 text-[10px] font-medium tracking-widest uppercase text-foreground/80">
              REEL_2026 · MASTER.MP4
            </span>
            <span className="absolute bottom-4 right-4 text-[10px] font-medium tracking-widest uppercase text-foreground/80 tabular-nums">
              1920×1080 · 24fps
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute -top-10 right-0 text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
            >
              Close [ESC]
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${REEL_YT_ID}?autoplay=1&rel=0`}
              className="w-full h-full rounded-md border border-border"
              allow="autoplay"
              allowFullScreen
              title="Matsuo Showreel"
            />
          </div>
        </div>
      )}
    </section>
  );
}
