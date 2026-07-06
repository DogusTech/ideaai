import type { Metadata } from "next"
import { PenLine } from "lucide-react"
import { PageShell, PageHero } from "@/components/site/page-shell"
import { EmptyState } from "@/components/ui/empty-state"

export const metadata: Metadata = {
  title: "Blog — togetlink",
  description:
    "Stories, product updates, and field notes from the TogetLink team are coming soon.",
}

const CATEGORIES = ["Product", "Community", "Future of Work", "Founder Notes"]

export default function BlogPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Blog"
        title="TogetLink Blog"
        description="Stories, product updates, and field notes are coming soon."
      />

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-10">
          <EmptyState
            icon={<PenLine className="size-6" aria-hidden="true" />}
            title="No posts yet"
            description="We're just getting started. Stories, product updates, and field notes about trust-first professional networking will appear here soon."
          />
        </div>
      </section>
    </PageShell>
  )
}
