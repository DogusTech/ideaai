"use client"

import type { RegionId } from "@/lib/places/types"
import { REGION_LABELS } from "@/lib/places/region-detection"
import { cn } from "@/lib/utils"

const REGIONS: RegionId[] = ["turkey", "united_states", "global"]

interface RegionSwitcherProps {
  value: RegionId
  onChange: (region: RegionId) => void
  className?: string
}

export function RegionSwitcher({ value, onChange, className }: RegionSwitcherProps) {
  return (
    <div className={cn("flex items-center gap-1", className)} role="group" aria-label="Select region">
      <span className="mr-1 text-xs font-medium text-muted-foreground">Region:</span>
      {REGIONS.map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={value === r}
          onClick={() => onChange(r)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1",
            value === r
              ? "bg-brand-blue/10 text-brand-blue"
              : "text-muted-foreground hover:text-foreground hover:bg-muted",
          )}
        >
          {REGION_LABELS[r]}
        </button>
      ))}
    </div>
  )
}
