// TODO: swap placeholder client names with real ones
const CLIENTS = ["NEXUS_CORE", "FLUX_MEDIA", "VELOCITY_X", "SILICON_VALLEY", "CRAFT_STUDIOS"];

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
        <div className="flex flex-wrap items-center justify-between gap-x-12 gap-y-6">
          {CLIENTS.map((c) => (
            <a
              key={c}
              href="#"
              className="font-heading text-2xl tracking-tighter text-foreground/30 grayscale hover:grayscale-0 hover:text-accent transition-all duration-300"
            >
              {c}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
