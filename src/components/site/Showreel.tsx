import { useEffect, useState } from "react";
import posterImg from "@/assets/showreel-poster.jpg";
import { useReveal } from "@/hooks/use-reveal";
import {
  closeVideoModal,
  openVideoModal,
  useAnyVideoModalOpen,
} from "@/lib/modal-state";

const REEL_YT_ID = "o_SwaTpc0VQ";

export function Showreel() {
  const [open, setOpen] = useState(false);
  const ref = useReveal<HTMLDivElement>();
  const anyModalOpen = useAnyVideoModalOpen();

  useEffect(() => {
    if (open) {
      openVideoModal();
      return () => closeVideoModal();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Preview loops continuously; only pauses (unmounts) when a fullscreen
  // video modal is playing so the highlighted video stays smooth.
  const showPreview = !anyModalOpen;


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
            <span className="text-foreground text-sm tabular-nums">00:56:27</span>
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
            className="relative aspect-video w-full block overflow-hidden bg-surface shadow-glow-intense transition-shadow duration-500"
          >
            {/* Poster fallback beneath iframe */}
            <img
              src={posterImg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
            {/* Muted inline preview — only mounted while the hero is in view
                and no fullscreen modal is playing (keeps one YT decoder max) */}
            {showPreview && (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${REEL_YT_ID}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&iv_load_policy=3&disablekb=1&fs=0`}
                title="Matsuo showreel — silent preview"
                className="absolute inset-0 w-full h-full pointer-events-none scale-[1.35] group-hover:scale-[1.4] transition-transform duration-700"
                allow="autoplay; encrypted-media"
                tabIndex={-1}
                aria-hidden="true"
              />
            )}
            {/* Muted badge — top-right, above overlays */}
            <span className="absolute top-4 right-4 z-30 flex items-center gap-1.5 bg-background/70 backdrop-blur-sm border border-accent/30 text-foreground/90 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-widest uppercase">
              <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current" aria-hidden="true">
                <path d="M16.5 12A4.5 4.5 0 0014 8v2.18l2.45 2.45a4.22 4.22 0 00.05-.63zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.94 8.94 0 0021 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 003.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
              Muted · click for sound
            </span>

            {/* Editorial Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

            {/* Minimal Play UI */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full border border-accent/60 flex items-center justify-center bg-background/30 backdrop-blur-sm shadow-glow-soft group-hover:scale-110 group-hover:bg-accent/90 group-hover:border-accent transition-all duration-300">
                <svg
                  className="w-5 h-5 md:w-6 md:h-6 text-accent group-hover:text-accent-foreground fill-current translate-x-[2px] transition-colors"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
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
              src={`https://www.youtube-nocookie.com/embed/${REEL_YT_ID}?autoplay=1&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1`}
              className="w-full h-full rounded-md border border-border"
              allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Matsuo Showreel"
            />
          </div>
        </div>
      )}
    </section>
  );
}
