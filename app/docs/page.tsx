import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { PageHero, PageShell } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "Documentation — IdeaAI",
  description:
    "Learn how IdeaAI connects local Ollama models to Windows files, terminal commands, and autonomous engineering workflows.",
  alternates: { canonical: "https://ideaai.togetlink.com/docs" },
}

const faqs = [
  {
    question: "What is IdeaAI?",
    answer:
      "IdeaAI is a Windows desktop autonomous AI coding agent developed by Aeternexus, Inc. It connects local Ollama models to a selected project workspace, terminal commands, and file operations.",
  },
  {
    question: "Can IdeaAI work offline?",
    answer:
      "The local workflow can operate with a locally installed Ollama model when the model and project are available on the device. Cloud-controlled workflows require network access.",
  },
  {
    question: "Can IdeaAI modify files?",
    answer:
      "The desktop application can read and write files inside the user-selected workspace through its Electron IPC bridge. The browser-only web console does not receive unrestricted access to the computer filesystem.",
  },
  {
    question: "Can IdeaAI run terminal commands?",
    answer:
      "Yes. In the desktop workflow, commands run with the selected workspace as the working directory and their stdout and stderr are returned to the agent.",
  },
  {
    question: "What happens when the computer is turned off?",
    answer:
      "Local execution stops when the computer is off. Suitable background tasks can continue through IdeaAI's cloud control plane when that workflow is configured.",
  },
]

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
}

export default function DocsPage() {
  return (
    <PageShell>
      <Script
        id="ideaai-docs-faq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <PageHero
        eyebrow="IdeaAI Docs"
        title="A clear mental model for local-first AI engineering."
        description="Understand what runs on your Windows machine, what the cloud control plane does, and how IdeaAI reports real file and terminal activity."
      />

      <div className="mx-auto max-w-[1000px] px-5 py-16 lg:px-8 lg:py-20">
        <div className="rounded-3xl border border-border/70 bg-brand-surface/40 p-6 text-foreground sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-blue">
            Product definition
          </p>
          <p className="mt-3 text-lg leading-relaxed">
            IdeaAI is a Windows desktop autonomous AI coding agent developed by
            Aeternexus, Inc. It is designed to connect local Ollama models to
            terminal, filesystem, and engineering workflows through a controlled
            Electron IPC bridge.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            ["Local Ollama", "Run a model on the device for private, low-latency project work."],
            ["Workspace tools", "Inspect, read, write, and validate files inside a selected workspace."],
            ["Terminal feedback", "Return real stdout and stderr so the agent can diagnose failures."],
            ["Cloud control plane", "Continue configured background engineering workflows away from the desk."],
          ].map(([title, description]) => (
            <section key={title} className="rounded-2xl border border-border/70 bg-background p-6">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
            </section>
          ))}
        </div>

        <section id="faq" className="mt-16">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            What IdeaAI can and cannot access
          </h2>
          <div className="mt-6 space-y-4 text-muted-foreground">
            <p>
              The browser console is not a privileged gateway to the computer.
              Local file and terminal capabilities are provided by the installed
              desktop application.
            </p>
            <p>
              In the desktop workflow, the user selects a workspace and file
              operations are validated against that workspace boundary. A model
              response claiming that a file changed is not treated as proof; the
              application reports the actual write or command result.
            </p>
            <p>
              See the <Link className="font-medium text-brand-blue hover:underline" href="/security">security model</Link> for
              the boundary and execution details.
            </p>
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">
            Frequently asked questions
          </h2>
          <div className="mt-6 divide-y divide-border/70 rounded-2xl border border-border/70">
            {faqs.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="cursor-pointer list-none pr-6 font-semibold text-foreground">
                  {faq.question}
                </summary>
                <p className="mt-3 leading-relaxed text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  )
}
