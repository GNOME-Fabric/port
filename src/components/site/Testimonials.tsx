import { useReveal } from "@/hooks/use-reveal";
import anthonyAvatar from "@/assets/anthony-avatar.png.asset.json";
import luizaAvatar from "@/assets/luiza-avatar.jpg.asset.json";
import { useI18n } from "@/lib/i18n";

type Q = { n: string; quoteKey: string; name: string; roleKey: string; avatar: string };

const QUOTES: Q[] = [
  { n: "01", quoteKey: "test.q1", name: "Anthony C.", roleKey: "test.r1", avatar: anthonyAvatar.url },
  { n: "02", quoteKey: "test.q2", name: "Luiza V.", roleKey: "test.r2", avatar: luizaAvatar.url },
];

function Quote({ q }: { q: Q }) {
  const ref = useReveal<HTMLDivElement>();
  const { t } = useI18n();
  return (
    <div ref={ref} className="relative">
      <span className="absolute -top-10 left-0 text-8xl font-heading text-foreground/5 select-none">
        {q.n}
      </span>
      <blockquote className="text-xl md:text-2xl font-medium text-foreground/90 mb-6 leading-relaxed relative">
        “{t(q.quoteKey)}”
      </blockquote>
      <div className="flex items-center gap-3">
        <img
          src={q.avatar}
          alt={q.name}
          loading="lazy"
          className="size-10 rounded-full object-cover border border-accent/30 bg-surface shadow-glow-soft"
        />
        <div>
          <div className="text-sm font-semibold text-bright">{q.name}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
            {t(q.roleKey)}
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
