import { useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { Timecode } from "./Timecode";
import { ContactIcons } from "./ContactIcons";
import { useI18n } from "@/lib/i18n";
import { LeaderboardModal } from "./LeaderboardModal";

export function Hero() {
  const ref = useReveal<HTMLDivElement>();
  const { t } = useI18n();
  const [lbOpen, setLbOpen] = useState(false);

  return (
    <section id="top" className="pt-40 pb-16">
      <div ref={ref} className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-[40ch]">
            <span className="block text-accent text-sm font-medium tracking-[0.2em] mb-4 uppercase">
              {t("hero.kicker")}
            </span>
            <h1 className="font-heading text-7xl md:text-9xl leading-none text-foreground text-glow mb-6">
              Matsuo
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-[42ch] leading-relaxed mb-8">
              {t("hero.tagline")}
            </p>
            <div className="flex items-center gap-4">
              <ContactIcons size="sm" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.25em]">
                {t("hero.reach")}
              </span>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mb-1">
              {t("hero.timecode")}
            </div>
            <button
              type="button"
              onClick={() => setLbOpen(true)}
              aria-label={t("hero.tcHint")}
              title={t("hero.tcHint")}
              className="group block text-3xl font-heading text-accent leading-none text-glow transition hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-sm"
            >
              <Timecode />
              <span className="block mt-1 text-[9px] font-medium text-muted-foreground uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition">
                {t("hero.tcHint")}
              </span>
            </button>
          </div>
        </div>
      </div>
      <LeaderboardModal open={lbOpen} onClose={() => setLbOpen(false)} />
    </section>
  );
}
