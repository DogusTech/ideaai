"use client"

import { useState, type FormEvent } from "react"
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react"
import { TextField, TextAreaField } from "@/components/ui/field"

type Errors = { name?: string; email?: string; subject?: string; message?: string }
type Status = "idle" | "submitting" | "success"

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>("idle")

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") ?? "").trim()
    const email = String(form.get("email") ?? "").trim()
    const subject = String(form.get("subject") ?? "").trim()
    const message = String(form.get("message") ?? "").trim()

    const nextErrors: Errors = {}
    if (!name) nextErrors.name = "Please enter your name."
    if (!email) nextErrors.email = "Please enter your email address."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      nextErrors.email = "Enter a valid email address."
    if (!subject) nextErrors.subject = "Please add a subject."
    if (!message) nextErrors.message = "Please write a short message."

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setStatus("submitting")
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + "/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setStatus("success")
    } catch (err) {
      console.error(err)
      setErrors({ message: "Something went wrong. Please try again." })
      setStatus("idle")
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-brand-green/30 bg-brand-green/10 p-8 text-center">
        <CheckCircle2 className="mx-auto size-12 text-brand-green" />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Message sent successfully!
        </h2>
        <p className="mx-auto mt-2 max-w-md text-pretty text-muted-foreground">
          Thanks for reaching out. We've received your message and will get back to you shortly.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-3xl border border-border/70 bg-card p-6 sm:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <TextField
          label="Name"
          name="name"
          type="text"
          autoComplete="name"
          placeholder="Your name"
          error={errors.name}
        />
        <TextField
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          error={errors.email}
        />
      </div>
      <TextField
        label="Subject"
        name="subject"
        type="text"
        placeholder="How can we help?"
        error={errors.subject}
      />
      <TextAreaField
        label="Message"
        name="message"
        placeholder="Tell us a little about what you need."
        error={errors.message}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-brand-blue text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand-blue/30 disabled:opacity-70"
      >
        {status === "submitting" && (
          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
        )}
        Send message
      </button>
    </form>
  )
}
