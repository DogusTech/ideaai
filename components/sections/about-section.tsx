import { Building2, Globe2, Users2 } from "lucide-react"

export function AboutSection() {
  return (
    <article className="bg-background py-20 lg:py-28" aria-labelledby="about-heading">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8 items-center">
          
          {/* Left: Text Content */}
          <div className="flex flex-col justify-center">
            <h2 
              id="about-heading"
              className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl mb-6"
            >
              Building a more connected real-world ecosystem
            </h2>
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground text-pretty">
              <p>
                TogetLink was founded on a simple premise: the best professional connections don't happen in a crowded feed or an algorithmic timeline. They happen in coffee shops, coworking spaces, and local tech hubs where real work gets done.
              </p>
              <p>
                We are building the definitive network for professionals who value in-person serendipity. Whether you are a solo founder shipping your first MVP, or a designer looking for your next co-founder, TogetLink puts you in the same room as people who share your drive.
              </p>
            </div>
          </div>

          {/* Right: Trust Signals / Stats Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:pl-12">
            <div className="rounded-2xl border border-border/70 bg-muted/20 p-6 flex flex-col items-center text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                <Users2 className="size-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">500+</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">Pioneer Builders</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-6 flex flex-col items-center text-center">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-yellow/10 text-brand-yellow">
                <Globe2 className="size-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">Growing</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">Early Adopter Base</p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-muted/20 p-6 flex flex-col items-center text-center sm:col-span-2">
              <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                <Building2 className="size-6" />
              </div>
              <p className="text-3xl font-bold text-foreground">2 Major</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">Tech Ecosystems (USA & Turkey)</p>
            </div>
          </div>

        </div>
      </div>
    </article>
  )
}
