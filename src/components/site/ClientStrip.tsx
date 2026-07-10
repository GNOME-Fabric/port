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
        <div className="flex items-center justify-between gap-6 mb-8">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            Trusted collaborators
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {CHANNELS.map((c) => (
            <a
              key={c.handle}
              href={c.href}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 border border-border rounded-md px-3 py-3 text-foreground/50 hover:text-accent hover:border-accent/40 transition-all duration-300 group"
            >
              <Youtube className="size-4 shrink-0 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium tracking-tight truncate">{c.handle}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
