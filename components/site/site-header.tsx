"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Press", href: "/press" },
  { label: "Contact", href: "/contact" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand-blue text-white">
            <span className="size-3 rounded-full bg-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            togetlink
          </span>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href)
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-brand-surface text-brand-blue"
                      : "text-foreground/70 hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            )
          })}
        </ul>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="hidden rounded-full px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-muted hover:text-foreground sm:inline-flex"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="hidden h-10 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] sm:inline-flex"
          >
            Register
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-muted md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {open && (
        <div className="border-t border-border/70 bg-background md:hidden">
          <ul className="mx-auto flex max-w-[1200px] flex-col gap-1 px-5 py-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="mt-2 grid grid-cols-2 gap-3">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex h-11 items-center justify-center rounded-full bg-brand-blue text-sm font-semibold text-white transition-colors hover:bg-[#2569cc]"
              >
                Register
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
