"use client"

import { HUB_CATEGORIES, type HubCategory } from "@/lib/places/types"
import { cn } from "@/lib/utils"

export function HubFilterTabs({
  value,
  onChange,
}: {
  value: HubCategory | "all"
  onChange: (value: HubCategory | "all") => void
}) {
  return (
    <nav aria-label="Filter hubs by category">
      <ul className="flex flex-wrap gap-2">
        {HUB_CATEGORIES.map((cat) => {
          const active = cat.value === value
          return (
            <li key={cat.value}>
              <button
                type="button"
                onClick={() => onChange(cat.value)}
                aria-pressed={active}
                className={cn(
                  "inline-flex h-9 items-center rounded-full border px-4 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-brand-blue/40 focus-visible:outline-none",
                  active
                    ? "border-brand-blue bg-brand-blue text-white"
                    : "border-border bg-card text-foreground/70 hover:border-brand-blue/40 hover:text-foreground",
                )}
              >
                {cat.label}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
