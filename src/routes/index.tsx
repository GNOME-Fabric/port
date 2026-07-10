import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Showreel } from "@/components/site/Showreel";
import { CaseStudies } from "@/components/site/CaseStudies";
import { ClientStrip } from "@/components/site/ClientStrip";
import { Testimonials } from "@/components/site/Testimonials";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ParticlesBackground } from "@/components/site/ParticlesBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Matsuo — Video Editor" },
      {
        name: "description",
        content:
          "Portfolio of Matsuo",
      },
      { property: "og:title", content: "Matsuo — Video Editor" },
      {
        property: "og:description",
        content: "Portfolio of Matsuo",
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
    <div className="min-h-screen bg-background text-foreground relative">
      <ParticlesBackground />
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
