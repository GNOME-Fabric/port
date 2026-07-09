import { useReveal } from "@/hooks/use-reveal";

type Project = {
  n: string;
  fileId: string;
  title: string; // TODO: replace with the real video title
  category: string;
  metricLabel: string;
  metricValue: string; // TODO: replace with real number
  stack: string;
  description: string;
  thumb: string;
  href: string;
};

const YT = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const PROJECTS: Project[] = [
  {
    n: "01",
    fileId: "EDU_G9D",
    title: "Complex Ideas, No Skip", // TODO
    category: "Business / Educational — YouTube",
    metricLabel: "Avg. Retention",
    metricValue: "72%", // TODO
    stack: "Premiere · After Effects",
    description:
      "Long-form educational edit paced for information density without losing narrative rhythm.",
    thumb: YT("g9DVFUj4cAU"),
    href: "https://www.youtube.com/watch?v=g9DVFUj4cAU",
  },
  {
    n: "02",
    fileId: "EDU_QH4",
    title: "The Deep Dive Format", // TODO
    category: "Business / Educational — YouTube",
    metricLabel: "Avg. Retention",
    metricValue: "68%", // TODO
    stack: "Premiere · After Effects",
    description:
      "Explainer built around cold-open hooks, chapter breaks, and motion-typography emphasis beats.",
    thumb: YT("qH44hSe3cso"),
    href: "https://www.youtube.com/watch?v=qH44hSe3cso",
  },
  {
    n: "03",
    fileId: "GAM_9P4",
    title: "High-Energy Short", // TODO
    category: "Gaming / Entertainment — Short-form",
    metricLabel: "Views",
    metricValue: "1.1M", // TODO
    stack: "DaVinci Resolve · VFX",
    description:
      "Fast-cut entertainment piece using sound-design-driven pacing and hit-frame emphasis.",
    thumb: YT("9p4A67Q61TI"),
    href: "https://www.youtube.com/watch?v=9p4A67Q61TI",
  },
  {
    n: "04",
    fileId: "MO_1E7",
    title: "Motion Study", // TODO
    category: "Motion Design",
    metricLabel: "Format",
    metricValue: "MOTION",
    stack: "After Effects",
    description:
      "Standalone motion piece exploring typographic rhythm and easing curves in the reel palette.",
    thumb: "", // Drive assets aren't hot-linkable — leave empty and render the surface state
    href: "https://drive.google.com/file/d/1E7Jr-VFx5IedqVxJ2ceSmv8ccbodcMTx/view",
  },
];

function Entry({ p }: { p: Project }) {
  const ref = useReveal<HTMLAnchorElement>();
  return (
    <a
      ref={ref}
      href={p.href}
      target="_blank"
      rel="noreferrer noopener"
      className="space-y-6 block group"
    >
      <div className="flex justify-between items-end border-b border-border pb-2">
        <span className="font-heading text-2xl text-accent">{p.n}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          File ID: {p.fileId}
        </span>
      </div>
      <div className="w-full aspect-video bg-surface border border-border rounded-md overflow-hidden relative">
        {p.thumb ? (
          <img
            src={p.thumb}
            alt={p.title}
            loading="lazy"
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
          />
        ) : (
          <div className="w-full h-full grid place-items-center">
            <span className="font-heading text-4xl text-accent/40 tracking-widest">
              {p.n}
            </span>
          </div>
        )}
        <span className="absolute top-3 left-3 text-[10px] font-medium tracking-widest uppercase text-foreground/80 bg-background/60 px-2 py-1 rounded-sm backdrop-blur-sm">
          OPEN ↗
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
    </a>
  );
}

export function CaseStudies() {
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
            <Entry key={p.n} p={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
