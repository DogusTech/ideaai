import { Navbar } from "@/components/hero/navbar"
import { Hero } from "@/components/hero/hero"
import { GoalsSection } from "@/components/sections/goals-section"
import { PricingSection } from "@/components/sections/pricing-section"
import { FAQSection } from "@/components/sections/faq-section"
import { SiteFooter } from "@/components/site/site-footer"

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />

        {/* Thin divider between hero and goals */}
        <div aria-hidden="true" className="h-px bg-border/50" />

        <GoalsSection />

        <PricingSection />

        <div aria-hidden="true" className="h-px bg-border/50" />

        <FAQSection />
      </main>
      <SiteFooter />
    </div>
  )
}
