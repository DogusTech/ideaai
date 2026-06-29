"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus, Minus } from "lucide-react"

type FAQ = {
  question: string
  answer: string
}

const FAQS: FAQ[] = [
  {
    question: "What is TogetLink?",
    answer:
      "TogetLink is a phygital professional networking platform that helps people discover nearby professional hubs — such as cafés, coworking spaces, libraries, and campus spaces — and connect with other professionals working there in a privacy-safe, consent-first way.",
  },
  {
    question: "How does TogetLink help professionals meet nearby?",
    answer:
      "You share what you are working on, how others can broadly recognise you, and what kind of collaboration you are open to. Others nearby with matching intent can then discover your profile and initiate a respectful introduction — entirely on your terms.",
  },
  {
    question: "Is TogetLink a social network or a real-world networking platform?",
    answer:
      "TogetLink is designed primarily for real-world moments. Unlike social networks that live online, TogetLink bridges your digital professional context with the physical venue you are currently in, making introductions feel natural and well-timed.",
  },
  {
    question: "Can I control what others see about me?",
    answer:
      "Yes. You choose exactly what signals to share — your work focus, collaboration type, and how you can be recognised in person. Nothing is shared without your explicit input, and you can adjust or remove your signals at any time.",
  },
  {
    question: "Does TogetLink show my exact location?",
    answer:
      "No. TogetLink uses broad area context only — for example, 'window desk area' or 'quiet corner'. Your exact GPS location is never exposed to other users. The system is designed so that recognition relies on your voluntary description, not precise tracking.",
  },
  {
    question: "What are professional intent signals?",
    answer:
      "Intent signals are short, structured descriptions of what you are working on and what kind of collaboration you welcome. Examples include 'looking for a co-founder', 'open to design feedback', or 'happy to pair-program'. They help others understand at a glance whether reaching out makes sense.",
  },
  {
    question: "Which venues can appear on TogetLink?",
    answer:
      "Any publicly accessible professional space can appear: cafés, coworking studios, public libraries, campus hubs, startup incubators, community centres, parks, and outdoor work areas. Venues are surfaced based on relevance and community activity, not advertising.",
  },
  {
    question: "Is the profile marquee live data?",
    answer:
      "No. The profile cards shown in the 'See what people are building nearby' section are illustrative demo profiles only. They are designed to show how TogetLink would look in real use, not to represent actual users. This is clearly labelled throughout.",
  },
  {
    question: "What is included in the Free plan?",
    answer:
      "The Free plan lets you browse public venue listings, explore demo activity, and understand how TogetLink works. It is designed for discovery and orientation before you decide to activate your professional presence.",
  },
  {
    question: "What is Pro for?",
    answer:
      "Pro is for active builders who want to become discoverable, send and receive introduction requests, and get matched with nearby professionals based on their intent signals. It is built for people who attend venues regularly and want to make those sessions more productive.",
  },
  {
    question: "How can companies or venues work with TogetLink?",
    answer:
      "Organisations can explore Enterprise access to invite high-intent professionals to verified spaces, run curated events, and support talent discovery in context. Venue partnerships are handled through our dedicated onboarding process. Reach out at info@aeternexus.com.",
  },
  {
    question: "How can I contact the team?",
    answer:
      "You can reach the TogetLink team directly by emailing info@aeternexus.com. We respond to questions about early access, partnerships, venue onboarding, and general product enquiries.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [allExpanded, setAllExpanded] = useState(false)
  const [expandedSet, setExpandedSet] = useState<Set<number>>(new Set())

  function toggle(i: number) {
    setExpandedSet((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function handleExpandAll() {
    if (allExpanded) {
      setExpandedSet(new Set())
      setAllExpanded(false)
    } else {
      setExpandedSet(new Set(FAQS.map((_, i) => i)))
      setAllExpanded(true)
    }
  }

  const isOpen = (i: number) => expandedSet.has(i)

  return (
    <section
      id="faq"
      className="relative overflow-hidden py-24 lg:py-32"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-10">
        {/* Heading row */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2
            id="faq-heading"
            className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl"
          >
            Frequently asked questions
          </h2>
          <button
            onClick={handleExpandAll}
            className="shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
          >
            {allExpanded ? "Collapse all" : "Expand all"}
          </button>
        </div>

        {/* Accordion */}
        <div className="flex flex-col divide-y divide-border/60">
          {FAQS.map((faq, i) => (
            <div key={faq.question}>
              <button
                id={`faq-btn-${i}`}
                aria-expanded={isOpen(i)}
                aria-controls={`faq-panel-${i}`}
                onClick={() => toggle(i)}
                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors hover:text-[var(--brand-blue)]"
              >
                <span className="text-base font-semibold text-foreground">{faq.question}</span>
                <span className="shrink-0 text-muted-foreground" aria-hidden="true">
                  {isOpen(i) ? <Minus className="size-5" /> : <Plus className="size-5" />}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen(i) && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pr-10 text-base leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
