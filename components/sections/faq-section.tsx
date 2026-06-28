"use client"

import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Plus } from "lucide-react"
import { Reveal } from "./reveal"

const FAQS = [
  {
    q: "What is TogetLink?",
    a: "TogetLink helps professionals discover who is open to building, collaborating, hiring, or meeting inside nearby real-world hubs.",
  },
  {
    q: "Is TogetLink a dating app?",
    a: "No. TogetLink is designed for professional networking, collaboration, hiring, startup building, and community discovery.",
  },
  {
    q: "Does TogetLink show exact locations?",
    a: "No. The product uses privacy-safe, broad professional context. Exact personal tracking is never exposed.",
  },
  {
    q: "How does Google Places API fit into TogetLink?",
    a: "Google Places API can power venue discovery, place details, photos, ratings, and location metadata. TogetLink adds the professional context layer on top.",
  },
  {
    q: "What is included in the Free plan?",
    a: "Free users can browse public hubs, create a basic profile, and discover the platform experience.",
  },
  {
    q: "What is included in Pro?",
    a: "Pro users can unlock deeper professional signals, request introductions, save venues, and get priority visibility.",
  },
  {
    q: "Who is Enterprise for?",
    a: "Enterprise is for companies, HR teams, universities, accelerators, coworking spaces, and professional communities.",
  },
  {
    q: "Is the data live?",
    a: "In this UI, venue and signal data is demo data. Production should connect to Google Places API and TogetLink's own privacy-safe backend.",
  },
]

function FaqItem({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: (typeof FAQS)[number]
  index: number
  open: boolean
  onToggle: () => void
}) {
  const reduceMotion = useReducedMotion()
  const panelId = `faq-panel-${index}`
  const buttonId = `faq-button-${index}`

  return (
    <div className="border-b border-border/60">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
        >
          <span className="text-base font-semibold text-foreground sm:text-lg">{faq.q}</span>
          <motion.span
            animate={{ rotate: open ? 45 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`flex size-7 shrink-0 items-center justify-center rounded-full ${
              open ? "bg-brand-blue text-white" : "bg-brand-surface text-brand-blue"
            }`}
          >
            <Plus className="size-4" aria-hidden="true" />
          </motion.span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 pr-10 text-pretty leading-relaxed text-muted-foreground">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section
      aria-labelledby="faq-heading"
      className="mx-auto max-w-3xl px-6 py-20 lg:py-28"
    >
      <Reveal className="text-center">
        <h2
          id="faq-heading"
          className="text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl"
        >
          Frequently asked questions
        </h2>
      </Reveal>

      <Reveal className="mt-12" delay={0.1}>
        <div>
          {FAQS.map((faq, i) => (
            <FaqItem
              key={faq.q}
              faq={faq}
              index={i}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </Reveal>
    </section>
  )
}
