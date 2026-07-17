import type { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { FAQSection } from "@/components/sections/faq-section"
import { Mail } from "lucide-react"

export const metadata: Metadata = {
  title: "Help & Support — TogetLink",
  description: "Get help and find answers to common questions.",
}

export default function HelpPage() {
  return (
    <DashboardShell>
      <div className="-mx-4 md:-mx-6 lg:-mx-8 -my-6">
        <FAQSection />
        
        {/* Contact Support Section */}
        <div className="bg-background pb-20 pt-10 text-center">
          <h3 className="text-xl font-semibold text-foreground">Still need help?</h3>
          <p className="mt-2 text-muted-foreground">Our support team is here to assist you.</p>
          <a
            href="mailto:support@togetlink.com"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <Mail className="size-4" />
            Contact Support
          </a>
        </div>
      </div>
    </DashboardShell>
  )
}
