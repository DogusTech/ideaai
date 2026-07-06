"use client"

import type { HubCategory } from "@/lib/places/types"
import { cn } from "@/lib/utils"

export type CategoryFilter = HubCategory | "all"

interface FilterTab {
  value: CategoryFilter
  label: string
}

const TABS: FilterTab[] = [
  { value: "all", label: "All" },
  { value: "coworking", label: "Coworking" },
  { value: "cafe", label: "Café" },
  { value: "park", label: "Park" },
  { value: "event", label: "Event" },
  { value: "startup_hub", label: "Startup Hub" },
  { value: "library", label: "Library" },
  { value: "university_hub", label: "University Hub" },
]

interface HubFilterTabsProps {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
  className?: string
}

export function HubFilterTabs({ value, onChange, className }: HubFilterTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter hubs by category"
      className={cn(
        "flex items-center gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {TABS.map((tab) => (
        <button
          key={tab.value}
          role="tab"
          type="button"
          aria-selected={value === tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            "inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1",
            value === tab.value
              ? "bg-brand-blue text-white"
              : "bg-white text-foreground/70 hover:bg-muted hover:text-foreground border border-border/60",
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
