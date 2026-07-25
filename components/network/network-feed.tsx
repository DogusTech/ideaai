"use client"

import { useEffect, useState } from "react"
import { Loader2, MapPin, Briefcase } from "lucide-react"
import { fetchApi } from "@/lib/api/client"
import { formatDistanceToNow } from "date-fns"

type Checkin = {
  id: string
  hubId: string
  uid: string
  locationStatus: string
  workingOn: string
  appearance: string
  createdAt: string
  user?: {
    name: string
    headline: string
    company: string
  }
  hub?: {
    name: string
    city: string
  }
}

const MOCK_NETWORK_FEED: Checkin[] = [
  {
    id: "net-1",
    hubId: "soho-house",
    uid: "u-1",
    locationStatus: "heads_down",
    workingOn: "Building a fintech MVP, looking for early testers.",
    appearance: "Black hoodie, AirPods",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    user: { name: "Alex Rivera", headline: "Frontend Developer", company: "Vercel" },
    hub: { name: "Soho House", city: "Istanbul" }
  },
  {
    id: "net-2",
    hubId: "kolektif-house",
    uid: "u-2",
    locationStatus: "open_to_collab",
    workingOn: "Drafting our seed deck. Open to chat!",
    appearance: "White t-shirt",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    user: { name: "Sarah Chen", headline: "Startup Founder", company: "TechFlow" },
    hub: { name: "Kolektif House", city: "Istanbul" }
  },
  {
    id: "net-3",
    hubId: "wework-sf",
    uid: "u-3",
    locationStatus: "heads_down",
    workingOn: "Figma grinding all afternoon.",
    appearance: "Glasses, blue sweater",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    user: { name: "Mehmet Yılmaz", headline: "Product Designer", company: "Acme Corp" },
    hub: { name: "WeWork Salesforce", city: "San Francisco" }
  }
];

export function NetworkFeed() {
  const [feed, setFeed] = useState<Checkin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function loadFeed() {
      try {
        const data = await fetchApi("/checkins/recent")
        if (data && data.length > 0) {
          setFeed(data)
        } else if (process.env.NODE_ENV === "development") {
          setFeed(MOCK_NETWORK_FEED)
        } else {
          setFeed([])
        }
        setLoading(false)
      } catch (err) {
        console.error(err)
        if (process.env.NODE_ENV === "development") {
          setFeed(MOCK_NETWORK_FEED)
          setLoading(false)
        } else {
          setError(true)
          setLoading(false)
        }
      }
    }
    loadFeed()
  }, [])

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
        Failed to load the network feed. Please try again later.
      </div>
    )
  }

  if (feed.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-slate-50/50 p-12 text-center">
        <h3 className="text-lg font-medium text-foreground">It's quiet here.</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          No one has checked into a hub yet. Be the first!
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {feed.map((checkin) => (
        <div
          key={checkin.id}
          className="flex flex-col gap-4 rounded-2xl border border-border bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:flex-row sm:items-start sm:p-6"
        >
          {/* Avatar Placeholder */}
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-blue/10 text-lg font-semibold text-brand-blue sm:size-14">
            {checkin.user?.name?.[0]?.toUpperCase() || "?"}
          </div>

          <div className="flex-1 space-y-3">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="font-semibold text-foreground">
                  {checkin.user?.name || "Anonymous Professional"}
                </h3>
                <span className="text-xs text-muted-foreground">
                  {checkin.createdAt && formatDistanceToNow(new Date(checkin.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {checkin.user?.headline || "Member"} {checkin.user?.company ? `at ${checkin.user.company}` : ""}
              </p>
            </div>

            {/* Checkin Details */}
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <div className="mb-2 flex items-center gap-2 font-medium text-brand-blue">
                <MapPin className="size-4" />
                Checked in at {checkin.hub?.name || "a Hub"} {checkin.hub?.city ? `(${checkin.hub.city})` : ""}
              </div>
              <p className="text-foreground">
                <span className="font-medium">Working on:</span> {checkin.workingOn}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                  <Briefcase className="size-3" />
                  {checkin.locationStatus === "open_to_collab" ? "Open to collaborate" : checkin.locationStatus === "heads_down" ? "Heads down working" : "Taking a break"}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">
                  Wearing {checkin.appearance.toLowerCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
