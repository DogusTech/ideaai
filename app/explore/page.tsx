import type { Metadata } from "next"

import { HubExplorePage } from "@/components/hubs/hub-explore-page"
import { SiteHeader } from "@/components/site/site-header"

export const metadata: Metadata = {
  title: "Explore professional hubs — Coworking, cafés, parks & events | TogetLink",
  description:
    "Discover real-world hubs where professionals meet in Turkey and the United States. Browse coworking spaces, cafés, parks, and startup hubs, see privacy-safe professional activity, and check in to collaborate.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore professional hubs | TogetLink",
    description:
      "Discover coworking spaces, cafés, parks, and startup hubs. See privacy-safe professional activity and check in to collaborate.",
    type: "website",
  },
}

export default function ExplorePage() {
  return (
    <main>
      <SiteHeader />
      <HubExplorePage />
    </main>
  )
}
