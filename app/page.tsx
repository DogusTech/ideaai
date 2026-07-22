import { Navbar } from "@/components/hero/navbar"
import { Hero } from "@/components/hero/hero"
import { GoalsSection } from "@/components/sections/goals-section"
import { FeaturedHubsSection } from "@/components/sections/featured-hubs-section"
import { AboutSection } from "@/components/sections/about-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { FAQSection } from "@/components/sections/faq-section"
import { SiteFooter } from "@/components/site/site-footer"
import Script from "next/script"

const webpageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "TogetLink - Build together, meet nearby",
  "description": "TogetLink connects you with builders, designers, and founders right around the corner. Discover local professional hubs in USA and Turkey.",
  "url": "https://togetlink.com",
  "publisher": {
    "@id": "https://togetlink.com/#organization"
  }
}

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background">
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <Navbar />
      <main>
        <Hero />

        {/* Thin divider between hero and goals */}
        <div aria-hidden="true" className="h-px bg-border/50" />

        <GoalsSection />

        <FeaturedHubsSection />

        <AboutSection />

        <PricingSection />

        <div aria-hidden="true" className="h-px bg-border/50" />

        <FAQSection />
      </main>
      <SiteFooter />
    </div>
  )
}
