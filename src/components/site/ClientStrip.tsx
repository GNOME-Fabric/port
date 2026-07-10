import { Youtube } from "lucide-react";

const CHANNELS = [
  { handle: "@RyanScribner", href: "https://www.youtube.com/@RyanScribner" },
  { handle: "@LewisWJackson", href: "https://www.youtube.com/@LewisWJackson" },
  { handle: "@QANorthAmerica", href: "https://www.youtube.com/@QANorthAmerica" },
  { handle: "@futuresfanatic", href: "https://www.youtube.com/@futuresfanatic" },
  { handle: "@worldwidequickbooks", href: "https://www.youtube.com/@worldwidequickbooks" },
  { handle: "@ChronometerCheck", href: "https://www.youtube.com/@ChronometerCheck" },
];

export function ClientStrip() {
  return (
    <section className="py-14 border-b border-border">
      <div className="max-w-6xl mx-auto px-6">
        {/* Technical Header */}
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="flex items-center gap-3">
            <span
              className="h-2 w-2 bg-accent"
              style={{ boxShadow: "0 0 8px color-mix(in oklab, var(--accent) 60%, transparent)" }}
              aria-hidden
            />
            <h2 className="text-[10px] uppercase tracking-[0.3em] text-accent font-mono font-bold">
              Trusted Collaborators
            </h2>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground/70 tabular-nums">
            REF_SYST // 06_NODES
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-border/60">
          {CHANNELS.map((c, i) => (
            <a
              key={c.handle}
              href={c.href}
              target="_blank"
              rel="noreferrer noopener"
              className="group relative border-r border-b border-border/60 p-6 transition-all duration-300 hover:bg-foreground/[0.03] last:lg:border-r-0"
            >
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-border group-hover:border-accent transition-colors" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-border group-hover:border-accent transition-colors" />

              <div className="flex flex-col gap-4">
                <span className="text-[9px] font-mono text-muted-foreground tabular-nums group-hover:text-accent/70 transition-colors">
                  {String(i + 1).padStart(2, "0")} // SRC
                </span>
                <div className="flex items-center gap-2 min-w-0">
                  <Youtube className="size-4 shrink-0 text-muted-foreground group-hover:text-accent transition-colors" />
                  <span className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors truncate">
                    {c.handle}
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Timeline Metadata Footer */}
        <div className="mt-3 flex items-center gap-4">
          <div
            className="h-1 flex-1"
            style={{
              background:
                "linear-gradient(to right, color-mix(in oklab, var(--accent) 25%, transparent), color-mix(in oklab, var(--border) 40%, transparent), transparent)",
            }}
            aria-hidden
          />
          <div className="flex gap-4 text-[8px] uppercase font-mono tracking-[0.2em] text-muted-foreground/70">
            <span>DATA_LOADED</span>
            <span className="text-accent/50">/</span>
            <span>VER_3.0.4</span>
          </div>
        </div>
      </div>
    </section>
  );
}
