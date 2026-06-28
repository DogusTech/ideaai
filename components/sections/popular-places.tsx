"use client"

import { MapPin, Star, Tag, Activity, ShieldCheck } from "lucide-react"
import { DEMO_VENUES, type TogetLinkVenue } from "@/lib/venues"
import { Reveal } from "./reveal"

function VenueCard({ venue, index }: { venue: TogetLinkVenue; index: number }) {
  return (
    <Reveal as="article" delay={index * 0.08}>
      <article className="group flex h-full flex-col rounded-3xl border border-border/70 bg-card p-6 shadow-[0_1px_2px_rgba(26,29,35,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:shadow-[0_20px_44px_-24px_rgba(47,122,231,0.4)]">
        <header className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-brand-surface px-3 py-1 text-xs font-semibold text-brand-blue">
            {venue.continent}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 px-2.5 py-1 text-xs font-semibold text-muted-foreground">
            <MapPin className="size-3" aria-hidden="true" />
            {venue.countryCode}
          </span>
        </header>

        <h3 className="mt-5 text-lg font-bold tracking-tight text-foreground text-balance">
          {venue.name}
        </h3>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Star className="size-4 text-brand-yellow" aria-hidden="true" />
            <dt className="sr-only">Rating</dt>
            <dd>
              <span className="font-semibold text-foreground">{venue.rating?.toFixed(1)}</span>{" "}
              demo rating
            </dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="size-4 text-brand-blue-soft" aria-hidden="true" />
            <dt className="sr-only">Category</dt>
            <dd>{venue.category}</dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="size-4 text-brand-red-soft" aria-hidden="true" />
            <dt className="sr-only">City</dt>
            <dd>
              {venue.city}, {venue.country}
            </dd>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Activity className="size-4 text-brand-green" aria-hidden="true" />
            <dt className="sr-only">Signal</dt>
            <dd>Live professional signal</dd>
          </div>
        </dl>

        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Who may be there
          </p>
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {venue.professionalSignals.map((signal) => (
              <li
                key={signal}
                className="rounded-full bg-brand-warm/70 px-2.5 py-1 text-xs font-medium text-foreground/80"
              >
                {signal}
              </li>
            ))}
          </ul>
        </div>
      </article>
    </Reveal>
  )
}

export function PopularPlaces() {
  return (
    <section
      aria-labelledby="popular-places-heading"
      className="mx-auto max-w-[1400px] px-6 py-20 lg:px-10 lg:py-28"
    >
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-xs font-semibold text-brand-green">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Google Places API ready
        </span>
        <h2
          id="popular-places-heading"
          className="mt-5 text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
        >
          Popular hubs where people build together
        </h2>
        <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
          Explore high-intent professional places across continents. TogetLink helps you understand
          the professional signal before you arrive.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {DEMO_VENUES.map((venue, i) => (
          <VenueCard key={venue.id} venue={venue} index={i} />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Demo venue data. Live availability and place details should be powered by Google Places API.
      </p>
    </section>
  )
}
