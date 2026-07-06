"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const NAV_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Places", href: "#places" },
  { label: "Explore", href: "/explore" },
  { label: "Plans", href: "#plans" },
  { label: "FAQ", href: "#faq" },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "border-b border-border/60 bg-background/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5" aria-label="TogetLink home">
            <Image
              src="/placeholder-logo.png"
              alt="TogetLink logo"
              width={32}
              height={32}
              className="size-8 rounded-xl object-contain"
            />
            <span className="text-lg font-bold tracking-tight text-foreground">
              TogetLink
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-8 md:flex" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/login"
              className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex h-10 items-center justify-center rounded-full bg-[var(--brand-blue)] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc]"
            >
              Join early access
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex size-10 items-center justify-center rounded-xl text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 top-[72px] z-40 border-b border-border/60 bg-background/95 px-6 pb-6 pt-4 backdrop-blur-xl md:hidden"
          >
            <ul className="flex flex-col gap-1" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm font-medium text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2">
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-full bg-[var(--brand-blue)] text-sm font-semibold text-white"
              >
                Join early access
              </Link>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="flex h-11 w-full items-center justify-center rounded-full border border-border text-sm font-medium text-foreground/80"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
