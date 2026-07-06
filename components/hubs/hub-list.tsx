import type { TogetlinkHub } from "@/lib/places/types"
import { HubCard } from "./hub-card"

interface HubListProps {
  hubs: TogetlinkHub[]
}

export function HubList({ hubs }: HubListProps) {
  if (hubs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <p className="text-base font-semibold text-foreground">No hubs found</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Try adjusting your search or switching to a different region.
        </p>
      </div>
    )
  }

  return (
    <ul
      aria-label={`${hubs.length} hub${hubs.length === 1 ? "" : "s"} found`}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
    >
      {hubs.map((hub) => (
        <li key={hub.id}>
          <HubCard hub={hub} />
        </li>
      ))}
    </ul>
  )
}
