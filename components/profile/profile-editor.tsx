"use client"

import { useState, useEffect, type FormEvent } from "react"
import { Loader2, CheckCircle2 } from "lucide-react"
import { TextField } from "@/components/ui/field"
import { fetchApi } from "@/lib/api/client"
import { useAuth } from "@/lib/auth/context"

type ProfileData = {
  name: string
  headline: string
  company: string
  bio: string
  linkedin: string
  website: string
  city: string
}

export function ProfileEditor() {
  const { user, loading: authLoading } = useAuth()
  const [data, setData] = useState<ProfileData>({
    name: "",
    headline: "",
    company: "",
    bio: "",
    linkedin: "",
    website: "",
    city: "",
  })
  const [status, setStatus] = useState<"loading" | "idle" | "submitting" | "success">("loading")
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (authLoading) return // wait for firebase auth to initialize
    
    if (!user) {
      setStatus("idle")
      return
    }

    async function loadProfile() {
      try {
        const res = await fetchApi("/users/me")
        if (res.profile) {
          setData({
            name: res.profile.name || "",
            headline: res.profile.headline || "",
            company: res.profile.company || "",
            bio: res.profile.bio || "",
            linkedin: res.profile.linkedin || "",
            website: res.profile.website || "",
            city: res.profile.city || "",
          })
        }
        setStatus("idle")
      } catch (err: any) {
        console.error(err)
        setStatus("idle")
      }
    }
    loadProfile()
  }, [user, authLoading])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMsg("")
    setStatus("submitting")

    try {
      await fetchApi("/users/me", {
        method: "PUT",
        body: JSON.stringify(data),
      })
      setStatus("success")
      setTimeout(() => setStatus("idle"), 3000)
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || "Failed to update profile. Please try again.")
      setStatus("idle")
    }
  }

  if (status === "loading") {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      {errorMsg && (
        <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {errorMsg}
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-md bg-brand-green/10 p-3 text-sm text-brand-green">
          <CheckCircle2 className="size-4" />
          Profile updated successfully!
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Full Name"
          name="name"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
          required
        />
        <TextField
          label="Professional Headline"
          name="headline"
          value={data.headline}
          onChange={(e) => setData({ ...data, headline: e.target.value })}
          placeholder="e.g. Senior Developer"
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Company"
          name="company"
          value={data.company}
          onChange={(e) => setData({ ...data, company: e.target.value })}
          placeholder="Where do you work?"
        />
        <TextField
          label="City"
          name="city"
          value={data.city}
          onChange={(e) => setData({ ...data, city: e.target.value })}
          placeholder="e.g. San Francisco, CA"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="LinkedIn URL"
          name="linkedin"
          type="url"
          value={data.linkedin}
          onChange={(e) => setData({ ...data, linkedin: e.target.value })}
          placeholder="https://linkedin.com/in/yourprofile"
        />
        <TextField
          label="Personal Website"
          name="website"
          type="url"
          value={data.website}
          onChange={(e) => setData({ ...data, website: e.target.value })}
          placeholder="https://yourwebsite.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="bio" className="text-sm font-medium text-foreground">
          Bio
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={4}
          className="rounded-xl border border-input bg-transparent px-4 py-3 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue/40"
          value={data.bio}
          onChange={(e) => setData({ ...data, bio: e.target.value })}
          placeholder="Tell us a little bit about yourself..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-brand-blue px-6 text-sm font-medium text-white transition-colors hover:bg-[#2569cc] disabled:opacity-70"
        >
          {status === "submitting" && (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          )}
          Save Changes
        </button>
      </div>
    </form>
  )
}
