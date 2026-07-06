import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MOCK_HUBS, getHubBySlug } from "@/lib/places/mock-hubs"
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

export async function generateStaticParams(): Promise<Params[]> {
  return MOCK_HUBS.map((hub) => ({
    country: hub.country.toLowerCase(),
    city: hub.city.toLowerCase().replace(/\s+/g, "-"),
    slug: hub.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const hub = getHubBySlug(slug)
  if (!hub) return {}

  const cityCountry = `${hub.city}, ${hub.country === "TR" ? "Turkey" : "United States"}`

  return {
    title: `${hub.name} — togetlink`,
    description:
      hub.description ??
      `${hub.name} in ${cityCountry}. See who's working there and connect with professionals nearby on togetlink.`,
  }
}

export default async function HubPage({ params }: PageProps) {
  const { slug } = await params
  const hub = getHubBySlug(slug)

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
