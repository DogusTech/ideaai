import { Navbar } from "@/components/hero/navbar"
import { Hero } from "@/components/hero/hero"
import { PopularPlaces } from "@/components/sections/popular-places"
import { GlobeIntelligence } from "@/components/sections/globe-intelligence"
import { PricingSection } from "@/components/sections/pricing-section"
import { PrivacyTrust } from "@/components/sections/privacy-trust"
import { FaqSection } from "@/components/sections/faq-section"
import { Footer } from "@/components/layout/footer"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />
      <PopularPlaces />
      <GlobeIntelligence />
      <PricingSection />
      <PrivacyTrust />
      <FaqSection />
      <Footer />
    </main>
  )
}
