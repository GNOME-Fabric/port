import { ContactIcons } from "./ContactIcons";
import { useI18n } from "@/lib/i18n";

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer id="contact" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h2 className="font-heading text-5xl md:text-6xl text-foreground text-glow mb-6">
              {t("footer.title")}
            </h2>
            <p className="text-muted-foreground max-w-[42ch] text-xs mb-8 uppercase tracking-widest">
              {t("footer.body")}
            </p>
            <ContactIcons />
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="font-heading text-7xl md:text-8xl text-foreground/5 leading-none mb-4">
              MATSUO
            </span>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.4em]">
              {t("footer.tag")}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
