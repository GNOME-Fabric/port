import { useI18n, type Lang } from "@/lib/i18n";

export function SiteNav() {
  const { lang, setLang, t } = useI18n();

  const btn = (l: Lang) =>
    `px-2 py-1 text-[10px] font-medium tracking-widest uppercase rounded-sm transition-colors ${
      lang === l
        ? "bg-accent text-accent-foreground"
        : "text-muted-foreground hover:text-foreground"
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-heading text-2xl tracking-wider text-bright text-glow hover:text-accent transition-colors"
        >
          MATSUO // EDIT
        </a>
        <div className="flex items-center gap-6 text-xs font-medium tracking-widest uppercase text-muted-foreground">
          <a href="#showreel" className="text-accent hover:text-bright transition-colors hidden sm:inline">
            {t("nav.reel")}
          </a>
          <a href="#work" className="hover:text-foreground transition-colors">
            {t("nav.projects")}
          </a>
          <a href="#contact" className="hover:text-foreground transition-colors">
            {t("nav.contact")}
          </a>
          <div
            role="group"
            aria-label="Language"
            className="inline-flex border border-border rounded-md p-0.5 bg-background/40"
          >
            <button type="button" onClick={() => setLang("en")} className={btn("en")} aria-pressed={lang === "en"}>
              EN
            </button>
            <button type="button" onClick={() => setLang("pt")} className={btn("pt")} aria-pressed={lang === "pt"}>
              PT
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
