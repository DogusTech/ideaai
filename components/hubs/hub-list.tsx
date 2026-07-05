"use client"

import { SearchX } from "lucide-react"

import type { TogetlinkHub } from "@/lib/places/types"
import { HubCard } from "./hub-card"

export function HubList({
  hubs,
  onCheckIn,
}: {
  hubs: TogetlinkHub[]
  onCheckIn: (hub: TogetlinkHub) => void
}) {
  if (hubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <SearchX className="size-6" aria-hidden="true" />
        </span>
        <h3 className="mt-4 text-base font-semibold text-foreground">
          No hubs match your search
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Try a different keyword, switch the category filter, or change your
          region to Global to widen the results.
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
      role="list"
      aria-label="Hub results"
    >
      {hubs.map((hub) => (
        <div role="listitem" key={hub.id}>
          <HubCard hub={hub} onCheckIn={onCheckIn} />
        </div>
      ))}
    </div>
  )
}
