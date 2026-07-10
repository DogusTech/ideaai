"use client"

import { useEffect, useState } from "react"
import { getMe } from "@/lib/api/auth"

export function ProfileSummary() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="rounded-xl border bg-white p-6 shadow-sm animate-pulse h-32"></div>

  if (!user) return <div className="rounded-xl border bg-white p-6 shadow-sm">Please log in</div>

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-brand-blue/10 text-xl font-bold text-brand-blue">
          {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">{user.name || "User"}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>
    </div>
  )
}
