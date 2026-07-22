import Image from "next/image"
import Link from "next/link"
import { MapPin, Users, ArrowRight } from "lucide-react"

const FEATURED_HUBS = [
  {
    id: "sf-coworking",
    name: "Downtown SF Creators Hub",
    location: "San Francisco, USA",
    image: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?w=800&q=80",
    description: "A bustling space for SaaS founders and designers.",
    activeUsers: 42,
    slug: "us/san-francisco/downtown-sf-creators-hub",
  },
  {
    id: "ist-cafe",
    name: "Karaköy Tech Cafe",
    location: "Istanbul, Turkey",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&q=80",
    description: "The favorite spot for indie hackers and developers in Istanbul.",
    activeUsers: 28,
    slug: "tr/istanbul/karakoy-tech-cafe",
  },
]

export function FeaturedHubsSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Discover Hubs Across the Globe
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From San Francisco to Istanbul, join vibrant local communities of builders and founders.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
          {FEATURED_HUBS.map((hub) => (
            <div
              key={hub.id}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-background shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted">
                <Image
                  src={hub.image}
                  alt={`Professional networking and coworking at ${hub.name} in ${hub.location}`}
                  width={800}
                  height={450}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  unoptimized // Using external URLs for now without adding to next.config
                />
              </div>
              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <p className="flex items-center text-sm font-medium text-brand-blue">
                      <MapPin className="mr-1.5 size-4" />
                      {hub.location}
                    </p>
                    <span className="flex items-center text-sm font-medium text-muted-foreground">
                      <Users className="mr-1.5 size-4" />
                      {hub.activeUsers} checked in
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-foreground">
                    {hub.name}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {hub.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center">
                  <Link
                    href={`/hubs/${hub.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-brand-blue hover:text-brand-blue/80"
                  >
                    View Hub <ArrowRight className="ml-1 size-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center rounded-md bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue/90"
          >
            Explore all locations
          </Link>
        </div>
      </div>
    </section>
  )
}
