import type { Metadata } from "next"
import { Mail, Newspaper, Handshake } from "lucide-react"
import { PageShell, PageHero } from "@/components/site/page-shell"
import { ContactForm } from "@/components/site/contact-form"

export const metadata: Metadata = {
  title: "Contact — togetlink",
  description:
    "Get in touch with the TogetLink team at Aeternexus Inc. for general inquiries, press, and partnerships.",
}

const CONTACT_CARDS = [
  {
    icon: Mail,
    title: "General inquiries",
    description: "Questions about TogetLink or your account.",
    email: "hello@togetlink.com",
  },
  {
    icon: Newspaper,
    title: "Press",
    description: "Media requests and company information.",
    email: "press@togetlink.com",
  },
  {
    icon: Handshake,
    title: "Partnerships",
    description: "Hubs, communities, and collaboration ideas.",
    email: "partnerships@togetlink.com",
  },
]

export default function ContactPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Contact"
        title="Let's talk."
        description="Have a question, a story, or a partnership idea? Reach out and the TogetLink team will get back to you."
      />

      <section className="mx-auto max-w-[1200px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="flex flex-col gap-4">
            {CONTACT_CARDS.map((card) => (
              <article
                key={card.title}
                className="flex items-start gap-4 rounded-2xl border border-border/70 bg-card p-6"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-surface text-brand-blue">
                  <card.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h2 className="font-semibold text-foreground">{card.title}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {card.description}
                  </p>
                  <a
                    href={`mailto:${card.email}`}
                    className="mt-2 inline-block text-sm font-medium text-brand-blue hover:underline"
                  >
                    {card.email}
                  </a>
                </div>
              </article>
            ))}
          </div>

          <div>
            <ContactForm />
          </div>
        </div>
      </section>
    </PageShell>
  )
}
