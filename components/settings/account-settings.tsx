"use client"

import { useState, useEffect } from "react"
import { Loader2, AlertCircle, Key, Check } from "lucide-react"
import { sendPasswordResetEmail, deleteUser } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { logout } from "@/lib/api/auth"
import { useRouter } from "next/navigation"

export function AccountSettings() {
  const router = useRouter()
  const [resetStatus, setResetStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "loading" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  
  const [apiKey, setApiKey] = useState("")
  const [saveKeyStatus, setSaveKeyStatus] = useState<"idle" | "saving" | "success">("idle")

  useEffect(() => {
    // Component yüklendiğinde var olan API key'i getir
    const storedKey = localStorage.getItem("ideaai_api_key")
    if (storedKey) {
      setApiKey(storedKey)
    }
  }, [])

  const handleSaveApiKey = () => {
    setSaveKeyStatus("saving")
    if (apiKey.trim() === "") {
      localStorage.removeItem("ideaai_api_key")
    } else {
      localStorage.setItem("ideaai_api_key", apiKey.trim())
    }
    
    setTimeout(() => {
      setSaveKeyStatus("success")
      setTimeout(() => setSaveKeyStatus("idle"), 2000)
    }, 500)
  }

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

      {/* BYOK: API Key Section */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-2">
          <Key className="size-5 text-indigo-500" />
          <h3 className="text-lg font-medium text-foreground">API Integrations (BYOK)</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
          IdeaAI operates on a Bring Your Own Key (BYOK) model. Enter your OpenAI or Google Gemini API key below to power the autonomous engine. Your key is stored securely and locally on your device.
        </p>
        
        <div className="flex gap-3">
          <div className="relative flex-1">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-proj-... or AIza..."
              className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <button
            onClick={handleSaveApiKey}
            disabled={saveKeyStatus === "saving"}
            className="inline-flex h-10 items-center justify-center rounded-md bg-zinc-900 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-zinc-800 disabled:opacity-70"
          >
            {saveKeyStatus === "saving" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : saveKeyStatus === "success" ? (
              <><Check className="size-4 mr-2" /> Saved</>
            ) : (
              "Save Key"
            )}
          </button>
        </div>
      </div>

      <hr className="border-border" />

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
