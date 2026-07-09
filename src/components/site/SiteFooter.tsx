const CONTACTS = [
  { label: "EMAIL", href: "mailto:visuals.sync@gmail.com" },
  { label: "DISCORD", href: "https://discord.com/users/matsuo.sync" },
  { label: "INSTAGRAM", href: "https://instagram.com/matsuo.art_" },
];

export function SiteFooter() {
  return (
    <footer id="contact" className="py-20 border-t border-border">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <h2 className="font-heading text-5xl md:text-6xl text-foreground mb-6">
              Start the Render
            </h2>
            <p className="text-muted-foreground max-w-[36ch] text-xs mb-8 uppercase tracking-widest">
              Currently accepting long-form and motion contracts. Reply within 24h.
            </p>
            <div className="flex gap-6">
              {CONTACTS.map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-xs font-medium tracking-[0.2em] text-accent hover:text-bright transition-colors"
                >
                  {c.label}
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
