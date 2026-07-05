"use client"

import { Globe } from "lucide-react"

import { REGION_OPTIONS } from "@/lib/places/region-detection"
import type { Region } from "@/lib/places/types"
import { cn } from "@/lib/utils"

export function RegionSwitcher({
  value,
  onChange,
}: {
  value: Region
  onChange: (value: Region) => void
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
        <Globe className="size-4" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Region</span>
      </span>
      <div
        role="radiogroup"
        aria-label="Choose region"
        className="inline-flex rounded-full border border-border bg-card p-1"
      >
        {REGION_OPTIONS.map((opt) => {
          const active = opt.value === value
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onChange(opt.value)}
              className={cn(
                "rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-blue/40 focus-visible:outline-none",
                active
                  ? "bg-brand-blue text-white"
                  : "text-foreground/70 hover:text-foreground",
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
