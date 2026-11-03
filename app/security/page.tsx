import type { Metadata } from "next"
import { PageHero, PageShell } from "@/components/site/page-shell"

export const metadata: Metadata = {
  title: "Security Model — IdeaAI",
  description:
    "How IdeaAI bounds local filesystem access, validates workspace paths, and separates browser, desktop, and cloud execution.",
  alternates: { canonical: "https://ideaai.togetlink.com/security" },
}

const principles = [
  ["Selected workspace boundary", "Local file reads and writes are resolved under the workspace selected by the user. Requests that escape that boundary should be rejected by the desktop bridge."],
  ["Explicit tool activity", "The model requests file reads, writes, or commands through structured tool blocks. The UI can show the resulting activity instead of treating prose as an execution record."],
  ["Real command output", "Terminal stdout and stderr are returned to the agent so it can reason from observed results rather than inventing a successful outcome."],
  ["Separate execution surfaces", "The browser application, Electron desktop application, local Ollama process, and cloud control plane have different capabilities and should not be treated as interchangeable."],
]

export default function SecurityPage() {
  return (
    <PageShell>
      <PageHero
        eyebrow="Security"
        title="Local power with an explicit execution boundary."
        description="IdeaAI is built around observable workspace operations rather than silent claims that a file changed or a command succeeded."
      />
      <div className="mx-auto max-w-[1000px] px-5 py-16 lg:px-8 lg:py-20">
        <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
          IdeaAI does not describe the browser as a privileged operating-system
          agent. Filesystem and terminal operations are available through the
          installed desktop application, where the user selects the workspace
          and the native bridge performs the operation.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {principles.map(([title, description]) => (
            <section key={title} className="rounded-2xl border border-border/70 bg-background p-6">
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>
            </section>
          ))}
        </div>
        <section className="mt-14 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
          <h2 className="text-xl font-semibold">Deployment note</h2>
          <p className="mt-3 leading-relaxed">
            Any public Ollama or cloud endpoint should be protected with
            authentication, HTTPS, and network restrictions appropriate to its
            environment. Do not expose an unauthenticated model endpoint to the
            public internet.
          </p>
        </section>
      </div>
    </PageShell>
  )
}
