"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const LINKS = ["Product", "Community", "Pricing", "About"]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <a href="#" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand-blue text-white">
            <span className="size-3 rounded-full bg-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            togetlink
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <li key={link}>
              <a
                href="#"
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#"
            className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </a>
          <a
            href="#"
            className="inline-flex h-10 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc]"
          >
            Get started
          </a>
        </div>
      </nav>
    </motion.header>
  )
}
