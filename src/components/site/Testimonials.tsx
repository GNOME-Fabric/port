import { useReveal } from "@/hooks/use-reveal";
import anthonyAvatar from "@/assets/anthony-avatar.png.asset.json";
import luizaAvatar from "@/assets/luiza-avatar.jpg.asset.json";

const QUOTES = [
  {
    n: "01",
    quote:
      "Great editor! Incredibly fast turnaround, quick communication and super receptive to feedback.",
    name: "Anthony C.",
    role: "Content Creator",
    avatar: anthonyAvatar.url,
  },
  {
    n: "02",
    quote:
      "Working with Mateus has been awesome! He's reliable and consistently delivers high-quality work. Definitely partnering up again for future projects!",
    name: "Luiza V.",
    role: "Content Creator",
    avatar: luizaAvatar.url,
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
        “{q.quote}”
      </blockquote>
      <div className="flex items-center gap-3">
        <img
          src={q.avatar}
          alt={q.name}
          loading="lazy"
          className="size-10 rounded-full object-cover border border-border bg-surface"
        />
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
