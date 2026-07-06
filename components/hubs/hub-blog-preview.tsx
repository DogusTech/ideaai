import type { TogetlinkHub } from "@/lib/places/types"
import { BookOpen } from "lucide-react"

interface HubBlogPreviewProps {
  guide: NonNullable<TogetlinkHub["guide"]>
}

export function HubBlogPreview({ guide }: HubBlogPreviewProps) {
  const date = new Date(guide.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <section
      aria-labelledby="guide-heading"
      className="rounded-2xl border border-border/60 bg-white p-6"
    >
      <div className="flex items-center gap-2 text-brand-blue">
        <BookOpen className="size-4 shrink-0" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wide">
          Hub guide
        </span>
      </div>
      <h2
        id="guide-heading"
        className="mt-2 text-lg font-bold text-foreground tracking-tight"
      >
        {guide.title}
      </h2>
      <p className="mt-0.5 text-xs text-muted-foreground">Published {date}</p>
      {/* Content rendered as plain text — no dangerouslySetInnerHTML */}
      <p className="mt-4 text-sm leading-relaxed text-foreground/80">
        {guide.body}
      </p>
    </section>
  )
}
