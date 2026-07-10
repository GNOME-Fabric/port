import { Mail, Instagram } from "lucide-react";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-1 0 26 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.317 4.369A19.79 19.79 0 0 0 16.558 3c-.2.36-.43.844-.59 1.23a18.27 18.27 0 0 0-5.487 0A12.6 12.6 0 0 0 9.883 3a19.74 19.74 0 0 0-3.76 1.369C2.68 9.548 1.75 14.579 2.215 19.54a19.9 19.9 0 0 0 6.073 3.07c.492-.672.93-1.386 1.307-2.136-.72-.271-1.41-.605-2.062-.996.173-.128.343-.262.507-.4a14.2 14.2 0 0 0 12.02 0c.166.14.336.273.508.4-.653.392-1.343.727-2.063.997.377.75.814 1.464 1.306 2.135a19.87 19.87 0 0 0 6.074-3.07c.545-5.744-.93-10.73-3.86-15.171ZM9.68 16.53c-1.183 0-2.157-1.086-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.202 0 2.176 1.086 2.157 2.42 0 1.334-.955 2.42-2.157 2.42Zm7.974 0c-1.183 0-2.157-1.086-2.157-2.42 0-1.334.955-2.42 2.157-2.42 1.202 0 2.176 1.086 2.157 2.42 0 1.334-.955 2.42-2.157 2.42Z" />
    </svg>
  );
}

export const CONTACTS = [
  { label: "Email", href: "mailto:visuals.sync@gmail.com", Icon: Mail },
  { label: "Discord", href: "https://discord.com/users/matsuo.sync", Icon: DiscordIcon },
  { label: "Instagram", href: "https://instagram.com/matsuo.art_", Icon: Instagram },
];

type Size = "sm" | "md";

export function ContactIcons({ size = "md" }: { size?: Size }) {
  const boxCls = size === "sm" ? "size-9" : "size-11";
  const iconCls = size === "sm" ? "size-4" : "size-5";
  return (
    <div className="flex gap-3">
      {CONTACTS.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          className={`${boxCls} grid place-items-center border border-border rounded-md text-foreground/70 hover:text-accent hover:border-accent/50 hover:shadow-glow transition-all duration-300`}
        >
          <Icon className={iconCls} />
        </a>
      ))}
    </div>
  );
}
