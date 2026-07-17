import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { PricingSection } from "@/components/sections/pricing-section"

export const metadata: Metadata = {
  title: "Pricing & Membership — TogetLink",
  description: "Upgrade your professional networking experience.",
}

export default function PricingPage() {
  return (
    <DashboardShell>
      <div className="-mx-4 md:-mx-6 lg:-mx-8 -my-6">
        <PricingSection />
      </div>
    </DashboardShell>
  )
}
