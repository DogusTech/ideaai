import { MapPinned } from "lucide-react"

import { Badge } from "@/components/ui/badge"

/**
 * Non-functional map placeholder.
 *
 * When a real map is added (e.g. Google Maps JS API or a library), replace the
 * inner placeholder with the map instance. Note: use a browser-only maps key
 * for the JS map — never the server-side Places Web Service key.
 */
export function HubMapPreview({ count }: { count?: number }) {
  return (
    <section
      aria-label="Map preview"
      className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
    >
      <div className="relative flex h-64 items-center justify-center bg-[repeating-linear-gradient(45deg,var(--secondary),var(--secondary)_12px,var(--muted)_12px,var(--muted)_24px)]">
        <div className="flex flex-col items-center gap-3 rounded-xl bg-card/90 px-6 py-5 text-center backdrop-blur-sm">
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-surface text-brand-blue">
            <MapPinned className="size-5" aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-foreground">Map view coming soon</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {count != null ? `${count} hubs in this region` : "Hub locations"} will
              appear here.
            </p>
          </div>
          <Badge variant="outline">Placeholder</Badge>
        </div>
      </div>
    </section>
  )
}
