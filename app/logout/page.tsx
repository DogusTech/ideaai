"use client"

import { useEffect } from "react"
import { logout } from "@/lib/api/auth"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { Loader2 } from "lucide-react"

export default function LogoutPage() {
  useEffect(() => {
    async function performLogout() {
      try {
        await logout()
        await signOut(auth)
      } catch (err) {
        console.error("Logout failed:", err)
      } finally {
        if (typeof document !== 'undefined') {
          document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }
        window.location.href = "/login"
      }
    }
    performLogout()
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="size-8 animate-spin text-brand-blue" />
        <p className="text-muted-foreground">Signing out...</p>
      </div>
    </div>
  )
}
