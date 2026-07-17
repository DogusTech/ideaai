"use client"

import { useState, useEffect } from "react"
import { Bell, MapPin, MessageCircle, Heart, UserPlus, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getNotifications, markAllNotificationsRead, type Notification } from "@/lib/api/notifications"

const iconMap: Record<string, any> = {
  checkin: { icon: MapPin, color: "text-brand-blue", bg: "bg-brand-blue/10" },
  message: { icon: MessageCircle, color: "text-brand-green", bg: "bg-brand-green/10" },
  like: { icon: Heart, color: "text-brand-red-soft", bg: "bg-brand-red-soft/10" },
  connection: { icon: UserPlus, color: "text-brand-yellow", bg: "bg-brand-yellow/10" },
  default: { icon: Bell, color: "text-foreground", bg: "bg-muted" },
}

export function NotificationFeed() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const notifs = await getNotifications()
        setNotifications(notifs)
      } catch (err) {
        console.error("Failed to fetch notifications", err)
      } finally {
        setLoading(false)
      }
    }
    fetchNotifs()
  }, [])

  const markAllAsRead = async () => {
    // Optimistic
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, unread: false }))
    )
    try {
      await markAllNotificationsRead()
    } catch (err) {
      console.error("Failed to mark all as read", err)
    }
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Stay updated with your network and nearby hubs.
          </p>
        </div>
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <Check className="size-4" />
          Mark all as read
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#e5e5e5] bg-white shadow-sm">
        {loading ? (
          <div className="flex justify-center p-12 text-muted-foreground"><Loader2 className="size-8 animate-spin" /></div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-[#e5e5e5]">
            {notifications.map((notif) => {
              const { icon: Icon, color, bg } = iconMap[notif.type] || iconMap.default
              
              // Handle optional createdAt mapping
              let timeStr = ""
              if (notif.createdAt) {
                const d = new Date(notif.createdAt)
                timeStr = d.toLocaleDateString() + " " + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }

              return (
                <div
                  key={notif.id}
                  className={cn(
                    "flex items-start gap-4 p-5 transition-colors hover:bg-[#fbfbfb]",
                    notif.unread ? "bg-brand-blue/5" : "bg-white"
                  )}
                >
                  <div className="relative shrink-0">
                    <img
                      src={notif.actorImg || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop&q=80"}
                      alt={notif.actorName}
                      className="size-12 rounded-full object-cover"
                    />
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full border-2 border-white",
                        bg
                      )}
                    >
                      <Icon className={cn("size-3", color)} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">{notif.actorName}</span> {notif.content}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">{timeStr}</p>
                  </div>
                  {notif.unread && (
                    <div className="shrink-0 pt-2">
                      <span className="block size-2.5 rounded-full bg-brand-blue" />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue mb-4">
              <Bell className="size-8" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">All caught up!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You don't have any new notifications at the moment.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
