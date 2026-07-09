import { useReveal } from "@/hooks/use-reveal";

// TODO: swap placeholder testimonials with real client quotes and attributions
const QUOTES = [
  {
    n: "01",
    quote:
      "Matsuo finds the rhythm in raw footage that others miss. Average view duration jumped 20% in the first month.",
    name: "Client Name",
    role: "Role, Company",
  },
  {
    n: "02",
    quote:
      "A master of retention. The technical precision and data-backed approach to editing make him invaluable to our pipeline.",
    name: "Client Name",
    role: "Role, Company",
  },
];

function Quote({ q }: { q: (typeof QUOTES)[number] }) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className="relative">
      <span className="absolute -top-10 left-0 text-8xl font-heading text-foreground/5 select-none">
        {q.n}
      </span>
      <blockquote className="text-xl md:text-2xl font-medium text-foreground/90 mb-6 leading-relaxed relative">
        {q.quote}
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="size-10 rounded-full bg-surface border border-border" />
        <div>
          <div className="text-sm font-semibold text-bright">{q.name}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {q.role}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  return (
    <section className="py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {QUOTES.map((q) => (
            <Quote key={q.n} q={q} />
          ))}
        </div>
      </div>
    </section>
  );
}
