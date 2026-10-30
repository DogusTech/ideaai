import Link from "next/link"
import { Mail, ArrowLeft, MessageCircle, ShieldCheck, BookOpen } from "lucide-react"

export const metadata = {
  title: "Support — IdeaAI",
  description: "Get help with IdeaAI authentication, local execution, and the autonomous workspace.",
}

const topics = [
  {
    icon: ShieldCheck,
    title: "Sign-in and verification",
    text: "Troubleshoot password sign-in, Google and GitHub authentication, or email verification codes.",
  },
  {
    icon: BookOpen,
    title: "Using the workspace",
    text: "Learn how IdeaAI handles local files, terminal commands, projects, and activity history.",
  },
  {
    icon: MessageCircle,
    title: "Night Shift",
    text: "Get help with local engine settings and autonomous engineering workflow configuration.",
  },
]

export default function SupportPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-12 text-zinc-900">
      <div className="mx-auto max-w-3xl">
        <Link href="/matrix-demo/app/login" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900">
          <ArrowLeft size={16} /> Back to sign in
        </Link>
        <div className="mt-16 max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-blue-600">IdeaAI Support</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">How can we help?</h1>
          <p className="mt-4 text-lg leading-8 text-zinc-500">
            Find guidance for your account, authentication, and autonomous engineering workspace.
          </p>
        </div>
        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {topics.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-zinc-200 p-5">
              <Icon size={20} className="text-blue-600" />
              <h2 className="mt-5 font-medium">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-500">{text}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl bg-zinc-50 p-6">
          <h2 className="text-lg font-medium">Still need help?</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-500">Send our team a message and include the email address associated with your IdeaAI account.</p>
          <a href="mailto:support@togetlink.com" className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800">
            <Mail size={16} /> Contact Support
          </a>
        </div>
      </div>
    </main>
  )
}
