import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getGuideForHub,
  getHubBySlug,
  getPresenceForHub,
  MOCK_HUBS,
} from "@/lib/places/mock-hubs"
import { hubHref } from "@/lib/places/hub-url"
import { CATEGORY_LABELS, COUNTRY_LABELS } from "@/lib/places/types"
import { HubDetailPage } from "@/components/hubs/hub-detail-page"
import { SiteHeader } from "@/components/site/site-header"

type RouteParams = { country: string; city: string; slug: string }

// Pre-render all known hubs (public + SEO-indexable).
export function generateStaticParams(): RouteParams[] {
  return MOCK_HUBS.map((hub) => ({
    country: hub.country.toLowerCase(),
    city: encodeURIComponent(hub.city.toLowerCase()),
    slug: hub.slug,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>
}): Promise<Metadata> {
  const { country, city, slug } = await params
  const hub = getHubBySlug(country, city, slug)

  if (!hub) {
    return { title: "Hub not found | TogetLink" }
  }

  const title = `${hub.name} — Professional Check-ins, Coworking & Networking | TogetLink`
  const description = `See what professionals are working on at ${hub.name}. Discover privacy-safe check-ins, collaboration intent, and nearby professional networking opportunities.`

  return {
    title,
    description,
    alternates: { canonical: hubHref(hub) },
    openGraph: { title, description, type: "article" },
  }
}

export default async function HubPage({
  params,
}: {
  params: Promise<RouteParams>
}) {
  const { country, city, slug } = await params
  const hub = getHubBySlug(country, city, slug)

  if (!hub) {
    notFound()
  }

  const guide = getGuideForHub(hub)
  const presence = getPresenceForHub(hub)
  const canonicalPath = hubHref(hub)

  // JSON-LD: BreadcrumbList + Place/LocalBusiness + BlogPosting for the guide.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Explore", item: "/explore" },
          { "@type": "ListItem", position: 2, name: COUNTRY_LABELS[hub.country] },
          { "@type": "ListItem", position: 3, name: hub.city },
          { "@type": "ListItem", position: 4, name: hub.name, item: canonicalPath },
        ],
      },
      {
        "@type": ["Place", "LocalBusiness"],
        name: hub.name,
        address: hub.formattedAddress ?? `${hub.city}, ${COUNTRY_LABELS[hub.country]}`,
        additionalType: CATEGORY_LABELS[hub.category],
        ...(hub.location
          ? {
              geo: {
                "@type": "GeoCoordinates",
                latitude: hub.location.lat,
                longitude: hub.location.lng,
              },
            }
          : {}),
        ...(hub.rating != null
          ? {
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: hub.rating,
                reviewCount: hub.userRatingCount ?? 0,
              },
            }
          : {}),
      },
      {
        "@type": "BlogPosting",
        headline: guide.title,
        description: guide.excerpt,
        dateModified: guide.updatedAt,
        articleBody: guide.body.join("\n\n"),
      },
    ],
  }

  return (
    <main>
      <SiteHeader />
      <script
        type="application/ld+json"
        // JSON.stringify output is safe structured data, not user HTML.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HubDetailPage hub={hub} guide={guide} presence={presence} />
    </main>
  )
}
