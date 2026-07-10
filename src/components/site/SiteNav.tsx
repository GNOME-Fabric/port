export function SiteNav() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-border bg-background/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <a
          href="#top"
          className="font-heading text-2xl tracking-wider text-bright text-glow hover:text-accent transition-colors"
        >
          MATSUO // EDIT
        </a>
        <div className="flex items-center gap-8 text-xs font-medium tracking-widest uppercase text-muted-foreground">
          <a href="#showreel" className="text-accent hover:text-bright transition-colors">
            [ REEL_2026 ]
          </a>
          <a href="#work" className="hover:text-foreground transition-colors">
            Projects
          </a>
          <a href="#contact" className="hover:text-foreground transition-colors">
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
}
