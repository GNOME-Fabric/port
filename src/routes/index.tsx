import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site/SiteNav";
import { Hero } from "@/components/site/Hero";
import { Showreel } from "@/components/site/Showreel";
import { CaseStudies } from "@/components/site/CaseStudies";
import { ClientStrip } from "@/components/site/ClientStrip";
import { Testimonials } from "@/components/site/Testimonials";
import { SiteFooter } from "@/components/site/SiteFooter";
import { ParticlesBackground } from "@/components/site/ParticlesBackground";
import { CustomCursor } from "@/components/site/CustomCursor";
import ogImage from "@/assets/og-matsuo.jpg.asset.json";

const OG_IMAGE_URL = `https://matsuo-portfolio.lovable.app${ogImage.url}`;

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
      { property: "og:url", content: "https://matsuo-portfolio.lovable.app/" },
      { property: "og:image", content: OG_IMAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    links: [{ rel: "canonical", href: "https://matsuo-portfolio.lovable.app/" }],
  }),
  component: Index,
});


function Index() {
  return (
    <div className="min-h-screen text-foreground relative">
      <ParticlesBackground />
      <div className="relative z-10">
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
    </div>
  );
}
