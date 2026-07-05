"use client"

import { useEffect, useRef, useState } from "react"
import { Search, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface HubSearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function HubSearchBar({
  value,
  onChange,
  placeholder = "Search hubs, cities, or categories…",
  className,
}: HubSearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)

  // Clear on Escape
  useEffect(() => {
    const el = inputRef.current
    if (!el) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange("")
    }
    el.addEventListener("keydown", handler)
    return () => el.removeEventListener("keydown", handler)
  }, [onChange])

  return (
    <div
      className={cn(
        "relative flex items-center rounded-2xl border bg-white shadow-sm transition-shadow",
        focused
          ? "border-brand-blue shadow-[0_0_0_3px_rgba(47,122,231,0.12)]"
          : "border-border/70 hover:border-border",
        className,
      )}
    >
      <Search
        className="ml-4 size-4 shrink-0 text-muted-foreground"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        role="searchbox"
        aria-label="Search hubs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent py-3 pl-3 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none"
        autoComplete="off"
        spellCheck={false}
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("")
            inputRef.current?.focus()
          }}
          aria-label="Clear search"
          className="mr-3 flex size-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue"
        >
          <X className="size-3.5" aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
