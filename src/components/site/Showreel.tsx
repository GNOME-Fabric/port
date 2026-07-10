import { useState } from "react";
import posterImg from "@/assets/showreel-poster.jpg";
import { useReveal } from "@/hooks/use-reveal";

const REEL_YT_ID = "o_SwaTpc0VQ";

export function Showreel() {
  const [open, setOpen] = useState(false);
  const ref = useReveal<HTMLDivElement>();

  return (
    <section id="showreel" className="pb-24">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        {/* Technical Header Meta */}
        <div className="flex justify-between items-end mb-4 text-[10px] font-medium uppercase tracking-[0.2em] text-accent/60">
          <div className="flex gap-6">
            <div className="flex flex-col">
              <span className="text-accent">Project ID</span>
              <span className="text-foreground">MT-SR-2026-V1</span>
            </div>
            <div className="flex flex-col">
              <span className="text-accent">Codec</span>
              <span className="text-foreground">ProRes 422 HQ</span>
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-accent">Global Timecode</span>
            <span className="text-foreground text-sm tabular-nums">00:00:42:18</span>
          </div>
        </div>

        {/* Main Reel Interactive Element */}
        <div className="relative group cursor-pointer">
          {/* Outer Border Scaffolding */}
          <div className="absolute -inset-2 border border-accent/10 pointer-events-none group-hover:border-accent/30 transition-colors duration-500" />
          {/* Corner Brackets */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-accent" />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-accent" />

          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Play showreel"
            className="relative aspect-video w-full block overflow-hidden bg-surface shadow-2xl"
          >
            <img
              src={posterImg}
              alt="Matsuo showreel poster"
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 opacity-60 group-hover:opacity-100"
            />

            {/* Editorial Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />

            {/* Center Play UI */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="relative">
                <h2
                  className="font-heading text-[8rem] sm:text-[12rem] md:text-[16rem] leading-none text-transparent select-none group-hover:text-accent/90 transition-all duration-500"
                  style={{ WebkitTextStroke: "1px color-mix(in oklab, var(--accent) 40%, transparent)" }}
                >
                  REEL
                </h2>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border border-accent flex items-center justify-center bg-background/40 backdrop-blur-sm group-hover:scale-110 group-hover:bg-accent transition-all duration-300">
                    <svg
                      className="w-8 h-8 md:w-10 md:h-10 text-accent group-hover:text-accent-foreground fill-current translate-x-1 transition-colors"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-foreground uppercase tracking-[0.4em] text-sm font-semibold opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                Initialize Playback
              </p>
            </div>

            {/* Scanning Line Effect */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="w-full h-px bg-accent/20 absolute top-1/4 animate-pulse" />
              <div className="w-full h-0.5 bg-foreground/5 absolute top-1/2" />
            </div>

            {/* Bottom Data Strip */}
            <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-center bg-gradient-to-t from-background/90 to-transparent">
              <div className="text-[10px] font-medium tracking-widest uppercase text-foreground/70 flex gap-4">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  REC : 04:12
                </span>
                <span>ISO 800</span>
                <span>FPS 23.976</span>
              </div>
              <div className="flex gap-1">
                <div className="w-1 h-4 bg-accent" />
                <div className="w-1 h-4 bg-accent/60" />
                <div className="w-1 h-4 bg-accent/30" />
                <div className="w-1 h-4 bg-accent/10" />
              </div>
            </div>
          </button>
        </div>

        {/* Metadata Grid */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-accent/10 pt-4">
          <div>
            <p className="text-accent text-xs font-semibold mb-1 uppercase tracking-widest">
              Technical Overview
            </p>
            <p className="text-foreground/60 text-[11px] leading-relaxed uppercase tracking-wider">
              Rhythmic editorial precision, motion design, and color science across educational, finance, and short-form work.
            </p>
          </div>
          <div className="md:border-l border-accent/10 md:pl-8">
            <p className="text-accent text-xs font-semibold mb-1 uppercase tracking-widest">
              Software Stack
            </p>
            <p className="text-foreground/60 text-[11px] uppercase tracking-tighter font-mono">
              PR / AE / DAVINCI RESOLVE / ILLUSTRATOR
            </p>
          </div>
          <div className="md:text-right">
            <p className="text-accent text-xs font-semibold mb-1 uppercase tracking-widest">
              Current Status
            </p>
            <p className="text-bright text-xs font-bold uppercase">
              Available for projects 2026
            </p>
          </div>
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
