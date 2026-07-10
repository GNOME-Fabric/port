import { ContactIcons } from "./ContactIcons";


export function SiteFooter() {
  return (
    <footer id="contact" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h2 className="font-heading text-5xl md:text-6xl text-foreground mb-6">
              Start the Render
            </h2>
            <p className="text-muted-foreground max-w-[42ch] text-xs mb-8 uppercase tracking-widest">
              Currently accepting long and short-form contracts. Reply within 24h.
            </p>
            <div className="flex gap-3">
              {CONTACTS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="size-11 grid place-items-center border border-border rounded-md text-foreground/70 hover:text-accent hover:border-accent/50 transition-all"
                >
                  <Icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="font-heading text-7xl md:text-8xl text-foreground/5 leading-none mb-4">
              MATSUO
            </span>
            <div className="text-[10px] font-medium text-muted-foreground uppercase tracking-[0.4em]">
              Cut with precision · 2026
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
