import { BookOpen, Clock } from "lucide-react"

import type { HubGuide } from "@/lib/places/types"
import { Badge } from "@/components/ui/badge"

/**
 * Public, SEO-indexable hub guide preview. Visible without login — never gated
 * behind a dashboard. User-provided text is rendered as plain strings only
 * (no dangerouslySetInnerHTML).
 */
export function HubBlogPreview({ guide }: { guide: HubGuide }) {
  return (
    <section
      id="guide"
      aria-labelledby="guide-heading"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <Badge variant="category">
          <BookOpen className="size-3.5" aria-hidden="true" />
          Hub guide
        </Badge>
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="size-3.5" aria-hidden="true" />
          {guide.readMinutes} min read
        </span>
      </div>

      <h2 id="guide-heading" className="mt-4 text-balance text-xl font-semibold text-foreground">
        {guide.title}
      </h2>
      <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
        {guide.excerpt}
      </p>

      <div className="mt-4 flex flex-col gap-3 text-sm leading-relaxed text-foreground/85">
        {guide.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <p className="mt-5 rounded-xl bg-secondary/60 px-4 py-3 text-sm text-foreground/80">
        Want to see who is here and check in?{" "}
        <a href="#" className="font-semibold text-brand-blue hover:underline">
          Create a free account
        </a>{" "}
        to join the conversation.
      </p>
    </section>
  )
}
