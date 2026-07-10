"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Users,
  MessageCircle,
  Bell,
  Search,
  ChevronDown,
  User,
  Briefcase,
  Settings,
  HelpCircle,
  Globe,
  Building2,
  CalendarDays,
} from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Network", href: "/network", icon: Users },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Notifications", href: "/notifications", icon: Bell },
] as const

const PROFILE_ITEMS = [
  { label: "View Profile", href: "/profile", icon: User },
  { label: "Become a Pro Member", href: "/pricing", icon: Briefcase },
  { label: "Settings & Privacy", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
  { label: "Language", href: "/settings/language", icon: Globe },
  { label: "Create Company Account", href: "/company/create", icon: Building2 },
  { label: "Events & Hubs", href: "/explore", icon: CalendarDays },
] as const

export function DashboardTopNav() {
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef<HTMLLIElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") return pathname === "/dashboard"
      return pathname.startsWith(href)
    },
    [pathname],
  )

  // Close dropdown on outside click
  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false)
      }
    }
    document.addEventListener("pointerdown", handlePointerDown)
    return () => document.removeEventListener("pointerdown", handlePointerDown)
  }, [])

  // Close dropdown on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setProfileOpen(false)
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#d6d6d6] bg-white"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/dashboard"
          aria-label="TogetLink home"
          className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-md"
        >
          <img
            src="/assets/logo.png"
            alt="TogetLink"
            className="h-8 w-auto object-contain"
            style={{ maxWidth: 140 }}
          />
        </Link>

        {/* Search */}
        <div className="relative hidden w-[280px] shrink-0 sm:block lg:w-[320px]">
          <label htmlFor="dashboard-search" className="sr-only">
            Search people, hubs, and services
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <input
            id="dashboard-search"
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search people, hubs, and services"
            className="h-9 w-full rounded-xl border border-[#e0e0e0] bg-[#f5f5f5] pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-blue focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 transition-colors"
            // TODO: connect to global search endpoint when available
          />
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Nav items */}
        <nav aria-label="Primary navigation">
          <ul className="flex items-stretch gap-0.5" role="list">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-14 flex-col items-center justify-center gap-0.5 px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 rounded-sm",
                      active
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-5 transition-colors",
                        active ? "text-foreground" : "text-muted-foreground",
                      )}
                      aria-hidden="true"
                    />
                    <span>{label}</span>
                    {/* Active underline */}
                    {active && (
                      <span
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-t-full"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                </li>
              )
            })}

            {/* Profile dropdown */}
            <li ref={profileRef} className="relative">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                aria-label="Profile menu"
                onClick={() => setProfileOpen((v) => !v)}
                className={cn(
                  "relative flex h-14 flex-col items-center justify-center gap-0.5 px-3 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 rounded-sm",
                  profileOpen
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-0.5">
                  <span className="flex size-5 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <User className="size-3" aria-hidden="true" />
                  </span>
                  <ChevronDown
                    className={cn(
                      "size-3 transition-transform",
                      profileOpen && "rotate-180",
                    )}
                    aria-hidden="true"
                  />
                </span>
                <span>Me</span>
                {profileOpen && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground rounded-t-full"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Dropdown */}
              {profileOpen && (
                <div
                  ref={dropdownRef}
                  role="menu"
                  aria-label="Profile menu"
                  className="absolute right-0 top-full z-50 mt-1 w-56 rounded-xl border border-[#e0e0e0] bg-white py-1.5 shadow-lg"
                >
                  {PROFILE_ITEMS.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-[#f5f5f5] focus-visible:bg-[#f5f5f5] focus-visible:outline-none transition-colors"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      {label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
