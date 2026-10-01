import type { Metadata } from "next"
import { PageShell } from "@/components/site/page-shell"
import { ArrowRight, Moon, Zap, ShieldCheck, HardDrive } from "lucide-react"

export const metadata: Metadata = {
  title: "Let AI Code Overnight: Autonomous Night Mode Agent | IdeaAI",
  description: "Stop burning the midnight oil. Use IdeaAI's Night Mode to let an autonomous AI coding agent build software while you sleep directly to your local files.",
}

export default function AiCodingOvernightPage() {
  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-40 lg:pb-32">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8 text-center">
          <div className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6">
            <Moon className="w-4 h-4 mr-2" />
            IdeaAI Night Mode
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6 text-foreground">
            Let AI Code <span className="text-primary">Overnight</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Why stay up late typing boilerplate? IdeaAI is the first autonomous AI coding agent with a dedicated night mode. Give it a goal, go to sleep, and wake up to a fully built software project saved directly to your local workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Download for Windows
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 md:py-24 bg-muted/50 border-y border-border/50">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-6">
                The problem with standard AI coding assistants
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Most developers use AI as a glorified autocomplete. You ask a question in a web interface, wait for the response, copy the code, paste it into your IDE, fix the syntax errors, and repeat.
                </p>
                <p>
                  If you want the AI to build a complex, multi-file feature, you have to sit there babysitting it for hours. If it hallucinates halfway through, you lose all context and have to start over. It's exhausting, and it doesn't scale.
                </p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-primary">The IdeaAI Solution</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Moon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">True Autonomous Night Mode</h4>
                    <p className="text-sm text-muted-foreground mt-1">Unlike chatbots, IdeaAI is designed to run unattended. Set it up at 11 PM and let it work for hours.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">Deterministic Guardrails</h4>
                    <p className="text-sm text-muted-foreground mt-1">Before it starts, IdeaAI asks you deterministic multiple-choice questions to lock in the architecture. This prevents overnight hallucinations.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Targeted Feature Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-[1200px] px-5 lg:px-8 text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">How to build software while you sleep</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stop pasting code. IdeaAI uses a hybrid cloud architecture to orchestrate complex reasoning on high-end GPUs, then securely writes the results directly to your machine.
          </p>
        </div>

        <div className="mx-auto max-w-[1200px] px-5 lg:px-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-6 text-left">
            <HardDrive className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Writes Directly to Local Files</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              IdeaAI is a native Windows application. It doesn't just give you code snippets; it creates folders, routes, and components directly in your local `C:\Users\...` workspace.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-left">
            <Zap className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Hybrid Cloud Engine</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your computer can sleep while our cloud Llama-3 GPUs do the heavy lifting. Once the reasoning is complete, the desktop app syncs and executes the file modifications.
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-6 text-left">
            <ShieldCheck className="h-8 w-8 text-primary mb-4" />
            <h3 className="text-xl font-bold mb-3">Senior Developer Mentorship</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              When you wake up, IdeaAI doesn't just leave you with unexplained code. It generates a detailed report explaining the theory and architecture behind every file it edited.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        <div className="mx-auto max-w-[800px] px-5 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to let AI do the night shift?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Join the indie hackers and developers who are shipping features 2x faster by turning their sleep hours into productive coding hours.
          </p>
          <a
            href="https://apps.microsoft.com/detail/9p9sfwqgbsk7?hl=en-US&gl=US"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-lg bg-background px-8 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105"
          >
            Get IdeaAI from Microsoft Store
          </a>
        </div>
      </section>
    </PageShell>
  )
}
