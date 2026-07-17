import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getHubBySlug } from "@/lib/api/hubs"
import { Navbar } from "@/components/hero/navbar"
import { SiteFooter } from "@/components/site/site-footer"
import { HubDetailPage } from "@/components/hubs/hub-detail-page"

interface Params {
  country: string
  city: string
  slug: string
}

interface PageProps {
  params: Promise<Params>
}



export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const hub = await getHubBySlug(slug)
  if (!hub) return {}

  const cityCountry = `${hub.city}, ${hub.country === "TR" ? "Turkey" : "United States"}`

  return {
    title: `${hub.name} — togetlink`,
    description:
      hub.description ??
      `${hub.name} in ${cityCountry}. See who's working there and connect with professionals nearby on togetlink.`,
    openGraph: {
      title: `${hub.name} — togetlink`,
      description:
        hub.description ??
        `Join professionals working from ${hub.name} in ${cityCountry}. Check in, share what you're working on, and network.`,
      type: "website",
      images: [
        {
          url: hub.photo?.photoUri || hub.photo?.url || "https://togetlink.com/images/fallback-hub.svg",
          width: 1200,
          height: 630,
          alt: `${hub.name} venue photo`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hub.name} — togetlink`,
      description:
        hub.description ??
        `Connect with professionals at ${hub.name} in ${cityCountry}.`,
    },
  }
}

export default async function HubPage({ params }: PageProps) {
  const { slug } = await params
  const hub = await getHubBySlug(slug)

  if (!hub) notFound()

  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main className="pt-[72px]">
        <HubDetailPage hub={hub} />
      </main>
      <SiteFooter />
    </div>
  )
}
