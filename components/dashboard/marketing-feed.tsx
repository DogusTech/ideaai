"use client"

import { Users, MessageSquare, MapPin } from "lucide-react"

const FAKE_ACTIVITIES = [
  {
    id: 1,
    user: "Alex Rivera",
    role: "Frontend Developer",
    action: "checked into",
    target: "Soho House Istanbul",
    time: "2 mins ago",
    avatar: "https://i.pravatar.cc/150?u=alex",
    message: "Working on some Next.js animations. Come say hi!",
  },
  {
    id: 2,
    user: "Sarah Chen",
    role: "Startup Founder",
    action: "posted in",
    target: "Kolektif House Levent",
    time: "15 mins ago",
    avatar: "https://i.pravatar.cc/150?u=sarah",
    message: "Looking for a technical co-founder to brainstorm over coffee ☕️",
  },
  {
    id: 3,
    user: "Mehmet Yılmaz",
    role: "Product Designer",
    action: "checked into",
    target: "Impact Hub Istanbul",
    time: "1 hour ago",
    avatar: "https://i.pravatar.cc/150?u=mehmet",
    message: "Figma grinding all afternoon. Free to review portfolios if anyone needs feedback.",
  },
  {
    id: 4,
    user: "Emily Davis",
    role: "Growth Marketer",
    action: "posted a goal near",
    target: "San Francisco",
    time: "2 hours ago",
    avatar: "https://i.pravatar.cc/150?u=emily",
    message: "Launching a new campaign next week. Would love to connect with local SEO experts.",
  },
]

export function MarketingFeed() {
  return (
    <div className="rounded-2xl border border-[#e5e5e5] bg-white p-5 shadow-sm mt-6">
      <div className="mb-4 flex items-center gap-2">
        <div className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-blue opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-brand-blue"></span>
        </div>
        <h2 className="text-sm font-semibold text-foreground">Live Network Activity</h2>
      </div>

      <div className="space-y-6">
        {FAKE_ACTIVITIES.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            {/* Avatar */}
            <div className="shrink-0">
              <img
                src={activity.avatar}
                alt={activity.user}
                className="size-10 rounded-full border border-border object-cover"
              />
            </div>
            
            {/* Content */}
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                <span className="font-semibold">{activity.user}</span>{" "}
                <span className="text-muted-foreground">{activity.action}</span>{" "}
                <span className="font-medium text-brand-blue cursor-pointer hover:underline">
                  {activity.target}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.role} • {activity.time}</p>
              
              {/* Message bubble */}
              <div className="mt-2 rounded-xl rounded-tl-none bg-brand-surface p-3 text-sm text-foreground/90 border border-brand-blue/10 relative">
                <div className="absolute -left-2 top-0 text-brand-surface">
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                    <path d="M8 0L0 0C0 0 4 0 8 8V0Z" />
                  </svg>
                </div>
                {activity.message}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
