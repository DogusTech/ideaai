import { Navbar } from "@/components/hero/navbar"
import { Hero } from "@/components/hero/hero"
import { DiscoverableSection } from "@/components/sections/discoverable-section"
import { PlansSection } from "@/components/sections/plans-section"
import { GoalsSection } from "@/components/sections/goals-section"
import { MarqueeSection } from "@/components/sections/marquee-section"
import { SupportSection } from "@/components/sections/support-section"
import { FAQSection } from "@/components/sections/faq-section"
import { Footer } from "@/components/sections/footer"

export default function Page() {
  return (
    <div className="relative overflow-x-hidden">
      <Navbar />
      <main id="main-content">
        <Hero />
        <GoalsSection />
        <DiscoverableSection />
        <PlansSection />
        <MarqueeSection />
        <SupportSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
