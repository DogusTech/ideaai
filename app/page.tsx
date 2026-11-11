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

const localBusinessSchema = [
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TogetLink Hub - San Francisco",
    "image": "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "San Francisco",
      "addressRegion": "CA",
      "addressCountry": "US"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TogetLink Hub - Istanbul",
    "image": "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Istanbul",
      "addressCountry": "TR"
    }
  }
]

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background">
      <Script
        id="webpage-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webpageSchema) }}
      />
      <Script
        id="localbusiness-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
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

