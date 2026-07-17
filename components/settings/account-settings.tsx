"use client"

import { useState } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { sendPasswordResetEmail, deleteUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { logout } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export function AccountSettings() {
  const router = useRouter()
  const [resetStatus, setResetStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  async function handlePasswordReset() {
    if (!auth.currentUser?.email) return
    setResetStatus("loading")
    try {
      await sendPasswordResetEmail(auth, auth.currentUser.email)
      setResetStatus("success")
      setTimeout(() => setResetStatus("idle"), 5000)
    } catch (err: any) {
      console.error(err)
      setErrorMessage(err.message)
      setResetStatus("error")
    }
  }

  async function handleDeleteAccount() {
    if (!auth.currentUser) return
    const confirmed = window.confirm(
      "Are you sure you want to completely delete your account? This action cannot be undone."
    )
    if (!confirmed) return

    setDeleteStatus("loading")
    try {
      await deleteUser(auth.currentUser)
      await logout()
      router.push("/")
    } catch (err: any) {
      console.error(err)
      // Usually fails if re-authentication is required
      if (err.code === "auth/requires-recent-login") {
        setErrorMessage("Please log out and log back in to verify your identity before deleting your account.")
      } else {
        setErrorMessage(err.message)
      }
      setDeleteStatus("error")
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          <AlertCircle className="size-5" />
          {errorMessage}
        </div>
      )}

      {/* Password Reset */}
      <div>
        <h3 className="text-lg font-medium text-foreground">Password</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Receive an email to securely change your password.
        </p>
        <button
          onClick={handlePasswordReset}
          disabled={resetStatus === "loading"}
          className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          {resetStatus === "loading" && <Loader2 className="mr-2 size-4 animate-spin" />}
          {resetStatus === "success" ? "Email sent!" : "Send reset email"}
        </button>
      </div>

      <hr className="border-border" />

      {/* Delete Account */}
      <div>
        <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Permanently delete your account and all associated data from TogetLink.
        </p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteStatus === "loading"}
          className="inline-flex h-9 items-center justify-center rounded-md bg-destructive px-4 text-sm font-medium text-destructive-foreground shadow-sm transition-colors hover:bg-destructive/90 disabled:opacity-50"
        >
          {deleteStatus === "loading" && <Loader2 className="mr-2 size-4 animate-spin" />}
          Delete account
        </button>
      </div>
    </div>
  )
}
