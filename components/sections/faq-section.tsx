"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

const FAQS: FAQItem[] = [
  {
    question: "What is TogetLink?",
    answer:
      "TogetLink is a professional networking platform that connects people through real-world places. Instead of cold messages in a feed, you discover nearby hubs — co-working spaces, meetups, and professional communities — and meet people who share your goals in person.",
  },
  {
    question: "How does TogetLink protect my privacy?",
    answer:
      "TogetLink is consent-first by design. You control who can see your profile, whether your location is shared, and who can reach out to you. Connections only happen when both sides choose to engage — you will never receive unsolicited contact.",
  },
  {
    question: "Is TogetLink only for finding co-working spaces?",
    answer:
      "No — co-working spaces are just one type of hub. TogetLink also surfaces professional meetups, community events, and informal gathering spots where people with shared interests tend to work. The goal is to help you find the people, not just the place.",
  },
  {
    question: "How is this different from LinkedIn or other professional networks?",
    answer:
      "LinkedIn and similar platforms focus on your digital presence and broadcast reach. TogetLink focuses on what happens after the introduction — the real-world meeting. We optimize for quality over volume, local over global, and trusted connections over raw follower counts.",
  },
  {
    question: "Is TogetLink free to join?",
    answer:
      "Yes, TogetLink is free to join. We plan to offer additional features for professionals and hub operators in the future, but the core networking experience will always have a free tier.",
  },
  {
    question: "Who is TogetLink built for?",
    answer:
      "TogetLink is built for independent professionals, founders, designers, engineers, consultants, and anyone who does knowledge work and wants to meet collaborators, clients, or co-founders nearby — rather than waiting for an algorithm to surface them.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [allOpen, setAllOpen] = useState(false)

  function toggleAll() {
    if (allOpen) {
      setAllOpen(false)
      setOpenIndex(null)
    } else {
      setAllOpen(true)
    }
  }

  function toggleItem(index: number) {
    if (allOpen) {
      // Exit "all open" mode and only keep the clicked one open
      setAllOpen(false)
      setOpenIndex(index)
    } else {
      setOpenIndex((prev) => (prev === index ? null : index))
    }
  }

  function isOpen(index: number) {
    return allOpen || openIndex === index
  }

  return (
    <section aria-labelledby="faq-heading" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-[860px] px-5 lg:px-8">
        {/* Header row */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-baseline">
          <h2
            id="faq-heading"
            className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          >
            Frequently asked questions
          </h2>
          <button
            type="button"
            onClick={toggleAll}
            className="shrink-0 text-sm font-medium text-brand-blue transition-colors hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
            aria-expanded={allOpen}
          >
            {allOpen ? "Collapse all" : "Expand all"}
            <span className="ml-1 text-xs" aria-hidden="true">
              {allOpen ? "\u2191" : "\u2193"}
            </span>
          </button>
        </div>

        {/* Accordion rows */}
        <dl className="mt-8 flex flex-col">
          {FAQS.map((faq, index) => {
            const open = isOpen(index)
            const itemId = `faq-answer-${index}`
            const buttonId = `faq-button-${index}`
            return (
              <div
                key={faq.question}
                className="border-b border-border/70 first:border-t"
              >
                <dt>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={open}
                    aria-controls={itemId}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left text-base font-medium text-foreground transition-colors hover:text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-blue/40"
                  >
                    <span>{faq.question}</span>
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border/70 text-foreground/70 transition-colors group-hover:text-brand-blue">
                      {open ? (
                        <Minus className="size-4" aria-hidden="true" />
                      ) : (
                        <Plus className="size-4" aria-hidden="true" />
                      )}
                    </span>
                  </button>
                </dt>
                <dd
                  id={itemId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="pb-5 pr-12 text-pretty text-base leading-relaxed text-muted-foreground"
                >
                  {faq.answer}
                </dd>
              </div>
            )
          })}
        </dl>
      </div>
    </section>
  )
}
