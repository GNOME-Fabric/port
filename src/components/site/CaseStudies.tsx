import { useEffect, useState } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { closeVideoModal, openVideoModal } from "@/lib/modal-state";
import { useI18n } from "@/lib/i18n";

type Project = {
  n: string;
  fileId: string;
  ytId: string;
  titleKey: string;
  categoryKey: string;
  metricValueKey: string;
  stack: string;
  descKey: string;
};

type CreatorCut = {
  n: string;
  ytId: string;
  title: string;
  format: "SHORT" | "LONG";
  views: string;
};

type OtherCase = {
  n: string;
  ytId: string;
  titleKey: string;
};

const YT = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

const PROJECTS: Project[] = [
  { n: "01", fileId: "FIN_G9D", ytId: "g9DVFUj4cAU", titleKey: "cs.p1.title", categoryKey: "cs.p1.category", metricValueKey: "cs.p1.client", stack: "Illustrator · After Effects", descKey: "cs.p1.desc" },
  { n: "02", fileId: "EDU_QH4", ytId: "qH44hSe3cso", titleKey: "cs.p2.title", categoryKey: "cs.p2.category", metricValueKey: "cs.p2.client", stack: "Premiere · After Effects", descKey: "cs.p2.desc" },
  { n: "03", fileId: "ENT_9P4", ytId: "9p4A67Q61TI", titleKey: "cs.p3.title", categoryKey: "cs.p3.category", metricValueKey: "cs.p3.client", stack: "After Effects", descKey: "cs.p3.desc" },
  { n: "04", fileId: "ADV_OXD", ytId: "oXdlgQFxXKg", titleKey: "cs.p4.title", categoryKey: "cs.p4.category", metricValueKey: "cs.p4.client", stack: "Premiere · After Effects", descKey: "cs.p4.desc" },
];

const BADGE: Record<string, string> = { "01": "MOTION", "02": "INTRO", "03": "SHORT", "04": "TEASER" };

const CREATOR_CUTS: CreatorCut[] = [
  { n: "05", ytId: "fUHbwtS3Xbg", title: "Creator Short — Cut A", format: "SHORT", views: "1.9M" },
  { n: "06", ytId: "1VY6riUQHd8", title: "Creator Short — Cut B", format: "SHORT", views: "2M" },
  { n: "07", ytId: "yxAgdK6P3Ws", title: "Long-form Feature — Ep. 01", format: "LONG", views: "100K" },
  { n: "08", ytId: "4BVeqHoqk0E", title: "Long-form Feature — Ep. 02", format: "LONG", views: "50K" },
  { n: "09", ytId: "vPvFLXpONDU", title: "Long-form Feature — Ep. 03", format: "LONG", views: "10K" },
];

const OTHER_CASES: OtherCase[] = [
  { n: "10", ytId: "oQIrNjYnyB0", titleKey: "cs.other1.title" },
  { n: "11", ytId: "oqIs5NEeXaY", titleKey: "cs.other2.title" },
];

function Entry({ p, onPlay }: { p: Project; onPlay: (id: string) => void }) {
  const ref = useReveal<HTMLButtonElement>();
  const { t } = useI18n();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPlay(p.ytId)}
      className="space-y-6 group text-left w-full flex flex-col h-full"
    >
      <div className="flex justify-between items-end border-b border-border pb-2">
        <span className="font-heading text-2xl text-accent text-glow-accent">{p.n}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          {t("cs.fileId")}: {p.fileId}
        </span>
      </div>
      <div className="w-full aspect-video bg-surface border border-border rounded-md overflow-hidden relative transition-all duration-500 group-hover:shadow-glow group-hover:border-accent/40">
        <img
          src={YT(p.ytId)}
          alt={t(p.titleKey)}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
        />
        <span className="absolute inset-0 bg-background/20 group-hover:bg-background/10 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center py-2 px-4 bg-accent text-accent-foreground font-medium rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
            <span className="text-xs tracking-widest uppercase">{t("cs.play")}</span>
          </span>
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-medium tracking-widest uppercase text-foreground/80 bg-background/60 px-2 py-1 rounded-sm backdrop-blur-sm">
          {p.n} · {BADGE[p.n]}
        </span>
      </div>
      <div className="flex flex-col md:flex-row gap-8 flex-1">
        <div className="flex-1 flex flex-col">
          <h3 className="font-heading text-3xl text-foreground mb-2 group-hover:text-accent transition-colors">
            {t(p.titleKey)}
          </h3>
          <p className="text-muted-foreground text-sm max-w-[48ch]">{t(p.descKey)}</p>
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-auto pt-3">
            {t(p.categoryKey)}
          </p>
        </div>
        <div className="grid grid-cols-2 md:block gap-4 md:space-y-4 shrink-0 border-l border-accent/20 pl-6">
          <div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              {t("cs.client")}
            </div>
            <div className="text-xl font-medium text-bright">{t(p.metricValueKey)}</div>
          </div>
          <div>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
              {t("cs.stackLabel")}
            </div>
            <div className="text-sm text-foreground/80">{p.stack}</div>
          </div>
        </div>
      </div>
    </button>
  );
}

function CutCard({ c, onPlay }: { c: CreatorCut; onPlay: (id: string) => void }) {
  const ref = useReveal<HTMLButtonElement>();
  const { t } = useI18n();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPlay(c.ytId)}
      className="text-left group block"
    >
      <div className="flex justify-between items-end border-b border-border pb-2 mb-3">
        <span className="font-heading text-lg text-accent">{c.n}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          {c.format}
        </span>
      </div>
      <div className="w-full aspect-video bg-surface border border-border rounded-md overflow-hidden relative transition-all duration-500 group-hover:shadow-glow group-hover:border-accent/40">
        <img
          src={YT(c.ytId)}
          alt={c.title}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        <span className="absolute inset-0 bg-background/25 group-hover:bg-background/10 transition-colors" />
        <span className="absolute top-3 left-3 flex items-center gap-1.5 bg-accent text-accent-foreground px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wider tabular-nums shadow-lg">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true">
            <path d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 11a4 4 0 110-8 4 4 0 010 8zm0-2a2 2 0 100-4 2 2 0 000 4z" />
          </svg>
          {c.views}
        </span>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs tracking-widest uppercase bg-background/80 text-foreground py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            {t("cs.play")}
          </span>
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="text-sm text-foreground/80 group-hover:text-accent transition-colors">
          {c.title}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest shrink-0">
          {c.views} {t("cs.views")}
        </span>
      </div>
    </button>
  );
}

function OtherCard({ o, onPlay }: { o: OtherCase; onPlay: (id: string) => void }) {
  const ref = useReveal<HTMLButtonElement>();
  const { t } = useI18n();
  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onPlay(o.ytId)}
      className="text-left group block"
    >
      <div className="flex justify-between items-end border-b border-border pb-2 mb-3">
        <span className="font-heading text-lg text-accent">{o.n}</span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          {t("cs.sample")}
        </span>
      </div>
      <div className="w-full aspect-video bg-surface border border-border rounded-md overflow-hidden relative transition-all duration-500 group-hover:shadow-glow group-hover:border-accent/40">
        <img
          src={YT(o.ytId)}
          alt={t(o.titleKey)}
          loading="lazy"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
        <span className="absolute inset-0 bg-background/25 group-hover:bg-background/10 transition-colors" />
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs tracking-widest uppercase bg-background/80 text-foreground py-1.5 px-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
            {t("cs.play")}
          </span>
        </span>
      </div>
      <div className="mt-3">
        <span className="text-sm text-foreground/80 group-hover:text-accent transition-colors block">
          {t(o.titleKey)}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
          {t("cs.otherLabel")}
        </span>
      </div>
    </button>
  );
}

type Tab = "cuts" | "creators" | "other";

export function CaseStudies() {
  const [playing, setPlaying] = useState<string | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    if (!playing) return;
    openVideoModal();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPlaying(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      closeVideoModal();
    };
  }, [playing]);
  const [tab, setTab] = useState<Tab>("cuts");

  const countLabel =
    tab === "cuts"
      ? t("cs.countSelected")
      : tab === "creators"
        ? `${t("cs.countCreators")} ${CREATOR_CUTS.length} / ${CREATOR_CUTS.length}`
        : `${t("cs.countOther")} ${OTHER_CASES.length} / ${OTHER_CASES.length}`;

  return (
    <section id="work" className="py-24 bg-surface/10 border-y border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 mb-10">
          <h2 className="font-heading text-4xl text-foreground text-glow">{t("cs.title")}</h2>
          <div className="h-px flex-1 bg-border" />
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">
            {countLabel}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Case studies view"
          className="inline-flex flex-wrap border border-border rounded-md p-1 mb-16 bg-background/40"
        >
          {(
            [
              { id: "cuts", label: t("cs.selected") },
              { id: "creators", label: t("cs.creators") },
              { id: "other", label: t("cs.other") },
            ] as { id: Tab; label: string }[]
          ).map((tt) => (
            <button
              key={tt.id}
              role="tab"
              aria-selected={tab === tt.id}
              onClick={() => setTab(tt.id)}
              className={`px-4 py-2 text-[11px] font-medium tracking-widest uppercase rounded-sm transition-colors ${
                tab === tt.id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tt.label}
            </button>
          ))}
        </div>

        {tab === "cuts" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-24">
            {PROJECTS.map((p) => (
              <Entry key={p.n} p={p} onPlay={setPlaying} />
            ))}
          </div>
        )}

        {tab === "creators" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {CREATOR_CUTS.map((c) => (
              <CutCard key={c.n} c={c} onPlay={setPlaying} />
            ))}
          </div>
        )}

        {tab === "other" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {OTHER_CASES.map((o) => (
              <OtherCard key={o.n} o={o} onPlay={setPlaying} />
            ))}
          </div>
        )}
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
              {t("reel.close")}
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
