import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";

type Project = {
  n: string;
  fileId: string;
  ytId: string;
  title: string;
  category: string;
  metricLabel: string;
  metricValue: string;
  stack: string;
  description: string;
};

const YT = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const PROJECTS: Project[] = [
  {
    n: "01",
    fileId: "FIN_G9D",
    ytId: "g9DVFUj4cAU",
    title: "Crypto Motion Cut",
    category: "Finance / Crypto — Advertisement",
    metricLabel: "Type",
    metricValue: "MOTION",
    stack: "Illustrator · After Effects",
    description:
      "Short-form motion design edit for educational and crypto content. Fast pacing without losing narrative rhythm.",
  },
  {
    n: "02",
    fileId: "EDU_QH4",
    ytId: "qH44hSe3cso",
    title: "Explainer Intro",
    category: "Educational — YouTube",
    metricLabel: "Type",
    metricValue: "INTRO",
    stack: "Premiere · After Effects",
    description:
      "Intro for explainer long-form content, built around strong hooks and motion-typography compositions.",
  },
  {
    n: "03",
    fileId: "ENT_9P4",
    ytId: "9p4A67Q61TI",
    title: "High-Energy Short",
    category: "Entertainment / Study — Short-form",
    metricLabel: "Type",
    metricValue: "SHORT",
    stack: "After Effects",
    description:
      "Study compilation of compositions with fast pacing, visual effects, and a flashy style.",
  },
  {
    n: "04",
    fileId: "ADV_OXD",
    ytId: "oXdlgQFxXKg",
    title: "Short-form Advertisement",
    category: "Advertisement — Short-form",
    metricLabel: "Type",
    metricValue: "TEASER",
    stack: "Premiere · After Effects",
    description:
      "Clean marketing short-form piece exploring typographic rhythm and easing curves in the reel palette.",
  },
];

function Entry({ p, onPlay }: { p: Project; onPlay: (id: string) => void }) {
  const ref = useReveal<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPlay(p.ytId)}
      className="space-y-6 block group text-left w-full"
    >
      <div className="flex justify-between items-end border-b border-border pb-2">
        <span className="font-heading text-2xl text-accent">{p.n}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          File ID: {p.fileId}
        </span>
      </div>
      <div className="w-full aspect-video bg-surface border border-border rounded-md overflow-hidden relative">
        <img
          src={YT(p.ytId)}
          alt={p.title}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
        />
        <span className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center py-2 px-4 bg-accent text-accent-foreground font-medium rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <span className="text-xs tracking-widest uppercase">Play</span>
          </span>
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-medium tracking-widest uppercase text-foreground/80 bg-background/60 px-2 py-1 rounded-sm backdrop-blur-sm">
          {p.n} · {p.metricValue}
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <h3 className="font-heading text-3xl text-foreground mb-2 group-hover:text-accent transition-colors">
            {p.title}
          </h3>
          <p className="text-muted-foreground text-sm max-w-[48ch]">{p.description}</p>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-3">
            {p.category}
          </p>
        </div>
        <div className="grid grid-cols-2 md:block gap-4 md:space-y-4 shrink-0 border-l border-accent/20 pl-6">
          <div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              {p.metricLabel}
            </div>
            <div className="text-xl font-medium text-bright">{p.metricValue}</div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              Stack
            </div>
            <div className="text-sm text-foreground/80">{p.stack}</div>
          </div>
        </div>
      </div>
    </button>
  );
}

export function CaseStudies() {
  const [playing, setPlaying] = useState<string | null>(null);

  return (
    <section id="work" className="py-24 bg-surface/10 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-16">
          <h2 className="font-heading text-4xl text-foreground">Case Studies</h2>
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Selected 04 / 04
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-24">
          {PROJECTS.map((p) => (
            <Entry key={p.n} p={p} onPlay={setPlaying} />
          ))}
        </div>
      </div>

      {playing && (
        <div
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex items-center justify-center p-6"
          onClick={() => setPlaying(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-6xl aspect-video"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPlaying(null)}
              className="absolute -top-10 right-0 text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-colors"
            >
              Close [ESC]
            </button>
            <iframe
              src={`https://www.youtube.com/embed/${playing}?autoplay=1&rel=0`}
              className="w-full h-full rounded-md border border-border"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title="Case study playback"
            />
          </div>
        </div>
      )}
    </section>
  );
}
