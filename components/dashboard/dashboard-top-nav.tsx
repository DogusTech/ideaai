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
  Menu,
  X,
  LogOut,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { logout } from "@/lib/api/auth"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

const NAV_ITEMS = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Network", href: "/network", icon: Users },
  { label: "Chat", href: "/chat", icon: MessageCircle },
  { label: "Notifications", href: "/notifications", icon: Bell },
] as const

const PROFILE_MAIN = [
  { label: "View Profile", href: "/profile", icon: User },
  { label: "Events & Hubs", href: "/explore", icon: CalendarDays },
  { label: "Become a Pro Member", href: "/pricing", icon: Briefcase },
  { label: "Create Company Account", href: "/company/create", icon: Building2 },
] as const

const PROFILE_SETTINGS = [
  { label: "Settings & Privacy", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: HelpCircle },
  { label: "Language", href: "/settings/language", icon: Globe },
] as const

export function DashboardTopNav() {
  const pathname = usePathname()
  const [searchValue, setSearchValue] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const profileRef = useRef<HTMLLIElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = useCallback(
    (href: string) => {
      if (href === "/dashboard") return pathname === "/dashboard"
      return pathname.startsWith(href)
    },
    [pathname],
  )

  const handleLogout = async () => {
    try {
      await logout()
      await signOut(auth)
      window.location.href = "/login"
    } catch (err) {
      console.error("Logout failed:", err)
    }
  }

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

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-[#d6d6d6] bg-white"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        
        {/* Left Section: Logo & Desktop Search */}
        <div className="flex items-center gap-4 lg:gap-8">
          <Link
            href="/dashboard"
            aria-label="TogetLink home"
            className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2 rounded-md"
          >
            <img
              src="/assets/logo.png"
              alt="TogetLink"
              className="size-8 object-contain"
            />
          </Link>

          {/* Desktop Search */}
          <div className="relative hidden w-[280px] shrink-0 md:block lg:w-[320px]">
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
            />
          </div>
        </div>

        {/* Right Section: Desktop Nav */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center">
          <ul className="flex items-stretch gap-1 lg:gap-2" role="list">
            {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
              const active = isActive(href)
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-label={label}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex h-14 min-w-[72px] flex-col items-center justify-center gap-0.5 px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 rounded-sm",
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

            {/* Desktop Profile Dropdown */}
            <li ref={profileRef} className="relative ml-2">
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen((v) => !v)}
                className={cn(
                  "relative flex h-14 min-w-[72px] flex-col items-center justify-center gap-0.5 px-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-1 rounded-sm",
                  profileOpen
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <span className="flex items-center gap-0.5">
                  <span className="flex size-6 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                    <User className="size-4" aria-hidden="true" />
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

              {/* Dropdown Menu */}
              {profileOpen && (
                <div
                  ref={dropdownRef}
                  role="menu"
                  className="absolute right-0 top-full z-50 mt-1 w-64 rounded-xl border border-[#e0e0e0] bg-white py-2 shadow-lg"
                >
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                        <User className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-foreground">My Profile</p>
                        <p className="text-xs text-muted-foreground">Professional Member</p>
                      </div>
                    </div>
                  </div>
                  
                  <hr className="my-1 border-[#e0e0e0]" />
                  
                  {PROFILE_MAIN.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-[#f5f5f5] transition-colors"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      {label}
                    </Link>
                  ))}

                  <hr className="my-1 border-[#e0e0e0]" />

                  {PROFILE_SETTINGS.map(({ label, href, icon: Icon }) => (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-foreground hover:bg-[#f5f5f5] transition-colors"
                    >
                      <Icon className="size-4 shrink-0 text-muted-foreground" />
                      {label}
                    </Link>
                  ))}

                  <hr className="my-1 border-[#e0e0e0]" />

                  <button
                    onClick={handleLogout}
                    role="menuitem"
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-brand-red-soft hover:bg-brand-red-soft/5 transition-colors"
                  >
                    <LogOut className="size-4 shrink-0" />
                    Sign Out
                  </button>
                </div>
              )}
            </li>
          </ul>
        </nav>

        {/* Right Section: Mobile Icons */}
        <div className="flex items-center gap-4 md:hidden">
          <button className="text-muted-foreground hover:text-foreground transition-colors p-2">
            <Search className="size-5" />
          </button>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="flex size-8 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
          >
            <User className="size-4" />
          </button>
        </div>
      </div>

      {/* Mobile Hamburger Full-Screen Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col bg-white md:hidden">
          {/* Mobile Menu Header */}
          <div className="flex h-14 items-center justify-between border-b border-[#d6d6d6] px-4">
            <span className="font-semibold text-foreground">Menu</span>
            <button 
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-full p-2 text-muted-foreground hover:bg-muted transition-colors focus-visible:outline-none"
            >
              <X className="size-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pb-safe">
            {/* Mobile Menu Profile Section */}
            <div className="p-4 border-b border-[#e0e0e0] bg-[#fdfdfd]">
              <div className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-blue/10 text-brand-blue">
                  <User className="size-6" />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-foreground">My Profile</p>
                  <Link 
                    href="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm font-medium text-brand-blue hover:underline"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            </div>

            {/* Mobile Primary Nav */}
            <nav className="p-2">
              <ul className="space-y-1">
                {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                  const active = isActive(href)
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-4 rounded-xl px-4 py-3 text-base font-medium transition-colors",
                          active ? "bg-brand-blue/10 text-brand-blue" : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Icon className={cn("size-5", active ? "text-brand-blue" : "text-muted-foreground")} />
                        {label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>

            <hr className="mx-4 my-2 border-[#e0e0e0]" />

            {/* Mobile Secondary Nav */}
            <div className="px-2 pb-8">
              <p className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Settings & More
              </p>
              <ul className="space-y-1">
                {[...PROFILE_MAIN.slice(1), ...PROFILE_SETTINGS].map(({ label, href, icon: Icon }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      <Icon className="size-4 text-muted-foreground" />
                      {label}
                    </Link>
                  </li>
                ))}
                <li>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-left text-sm font-medium text-brand-red-soft hover:bg-brand-red-soft/5 transition-colors"
                  >
                    <LogOut className="size-4" />
                    Sign Out
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
