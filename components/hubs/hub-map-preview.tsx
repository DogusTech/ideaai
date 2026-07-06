import { MapPin } from "lucide-react"

/**
 * HubMapPreview — placeholder card shown where an interactive map will appear.
 * Replace with a real map component (e.g. Mapbox, Google Maps JS API) when ready.
 * Never expose server-side API keys in client bundles.
 */
export function HubMapPreview() {
  return (
    <div
      className="flex h-full min-h-[260px] flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border/70 bg-brand-surface/40 p-8 text-center"
      aria-label="Map view coming soon"
    >
      <span className="flex size-12 items-center justify-center rounded-full bg-white shadow-sm">
        <MapPin className="size-6 text-brand-blue" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">Map view coming soon</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Interactive hub map powered by Google Places will appear here.
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground/60">
          API key is server-side only and never exposed to the client.
        </p>
      </div>
    </div>
  )
}
