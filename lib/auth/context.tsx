"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { onAuthStateChanged, signInAnonymously, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

type AuthContextType = {
  user: User | null
  loading: boolean
  isGuest: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, isGuest: false, error: null })
let anonymousSignIn: Promise<unknown> | null = null

export function AuthProvider({ children, anonymousForDesktop = false }: { children: ReactNode; anonymousForDesktop?: boolean }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    let attemptedAnonymousSignIn = false
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!mounted) return
      setUser(currentUser)
      if (currentUser) {
        setError(null)
        setLoading(false)
        return
      }

      const hasElectronBridge = typeof window !== 'undefined'
        && typeof (window as Window & { require?: unknown }).require === 'function'
      if (!anonymousForDesktop || !hasElectronBridge || attemptedAnonymousSignIn) {
        setLoading(false)
        return
      }

      attemptedAnonymousSignIn = true
      setLoading(true)
      anonymousSignIn ||= signInAnonymously(auth).catch((signInError) => {
        anonymousSignIn = null
        throw signInError
      })
      void anonymousSignIn
        .then(() => {
          anonymousSignIn = null
          if (mounted) setError(null)
        })
        .catch((signInError: unknown) => {
          if (mounted) setError(signInError instanceof Error ? signInError.message : 'Guest sign-in could not be completed.')
        })
        .finally(() => { if (mounted) setLoading(false) })
    })
    return () => { mounted = false; unsubscribe() }
  }, [anonymousForDesktop])

  return (
    <AuthContext.Provider value={{ user, loading, isGuest: Boolean(user?.isAnonymous), error }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

