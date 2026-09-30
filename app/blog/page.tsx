import type { Metadata } from "next"
import Link from "next/link"
import { PageShell, PageHero } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "Blog — IdeaAI",
  description:
    "Stories, product updates, and field notes from the IdeaAI team.",
}

const CATEGORIES = ["AI Agents", "Developer Tools", "Future of Work", "Product Updates"]

export default function BlogPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Blog"
        title="IdeaAI Blog"
        description="Insights on autonomous coding, AI agents, and preserving developer skills."
      />

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((category) => (
            <span
              key={category}
              className="inline-flex items-center rounded-full border border-border/70 bg-background px-4 py-2 text-sm font-medium text-muted-foreground"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Post Card */}
          <Link href="/blog/the-ai-coding-paradox" className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-md">
            <div className="space-y-2">
              <div className="text-xs font-medium text-primary">Developer Tools</div>
              <h3 className="text-xl font-bold tracking-tight text-card-foreground group-hover:text-primary transition-colors">
                The AI Coding Paradox: Are Autonomous Agents Making Developers Lazy?
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-3">
                AI coding assistants save time, but there's a dark side: developers are losing their architectural skills. Here is how we fixed it with IdeaAI.
              </p>
            </div>
            <div className="mt-auto pt-4 flex items-center text-xs text-muted-foreground">
              <span>Sept 30, 2026</span>
              <span className="mx-2">•</span>
              <span>4 min read</span>
            </div>
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
