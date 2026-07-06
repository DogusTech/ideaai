import type { Metadata } from "next"
import { Navbar } from "@/components/hero/navbar"
import { SiteFooter } from "@/components/site/site-footer"
import { HubExplorePage } from "@/components/hubs/hub-explore-page"

export const metadata: Metadata = {
  title: "Explore Professional Hubs — togetlink",
  description:
    "Discover coworking spaces, cafés, parks, and startup hubs near you. See who's working there now and connect with professionals in your city.",
}

export default function ExplorePage() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="pt-[72px]">
        <HubExplorePage />
      </main>
      <SiteFooter />
    </div>
  )
}
