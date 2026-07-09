import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Showreel } from "@/components/site/Showreel";
import { CaseStudies } from "@/components/site/CaseStudies";
import { ClientStrip } from "@/components/site/ClientStrip";
import { Testimonials } from "@/components/site/Testimonials";
import { SiteFooter } from "@/components/site/SiteFooter";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matsuo — Video Editor · Business, Educational & Motion" },
      {
        name: "description",
        content:
          "Portfolio of Matsuo — video editor making complex ideas impossible to skip. Long-form YouTube business & educational, motion design, gaming short-form.",
      },
      { property: "og:title", content: "Matsuo — Video Editor" },
      {
        property: "og:description",
        content: "Making complex ideas impossible to skip. Selected work & showreel.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <main>
        <Hero />
        <Showreel />
        <CaseStudies />
        <ClientStrip />
        <Testimonials />
      </main>
      <SiteFooter />
    </div>
  );
}
