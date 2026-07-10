"use client"

import { useEffect, useState } from "react"
import { getMyCheckins } from "@/lib/api/checkins"

export function MyCheckins() {
  const [checkins, setCheckins] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getMyCheckins()
      .then((data) => setCheckins(data || []))
      .catch(() => setCheckins([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900">My Check-ins</h2>
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 rounded-lg bg-slate-100"></div>
          <div className="h-16 rounded-lg bg-slate-100"></div>
        </div>
      ) : checkins.length === 0 ? (
        <p className="text-sm text-slate-500">You haven't checked into any hubs yet.</p>
      ) : (
        <div className="space-y-4">
          {checkins.map((checkin) => (
            <div key={checkin.id} className="rounded-lg border p-4">
              <p className="font-medium">{checkin.hubName || "Unknown Hub"}</p>
              <p className="text-xs text-slate-500">
                {new Date(checkin.createdAt?._seconds * 1000 || Date.now()).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
