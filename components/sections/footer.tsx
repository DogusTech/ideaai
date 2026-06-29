import Image from "next/image"

type FooterCol = {
  title: string
  links: { label: string; href: string }[]
}

const FOOTER_COLS: FooterCol[] = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Nearby hubs", href: "#places" },
      { label: "Professional intent", href: "#how-it-works" },
      { label: "Plans", href: "#plans" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About TogetLink", href: "#" },
      { label: "Aeternexus Inc.", href: "#" },
      { label: "Contact", href: "mailto:info@aeternexus.com" },
      { label: "Partnerships", href: "mailto:info@aeternexus.com" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Safety", href: "#" },
      { label: "Consent-first visibility", href: "#" },
      { label: "Demo data notice", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Blog", href: "#" },
      { label: "Help", href: "mailto:info@aeternexus.com" },
      { label: "Early access", href: "#plans" },
    ],
  },
]

const SOCIAL_LINKS = [
  { label: "X", href: "#", icon: "𝕏" },
  { label: "LinkedIn", href: "#", icon: "in" },
  { label: "YouTube", href: "#", icon: "▶" },
  { label: "Instagram", href: "#", icon: "◻" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30" aria-label="Site footer">
      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        {/* Top: Follow us */}
        <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Follow us
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={`TogetLink on ${s.label}`}
                  className="flex size-9 items-center justify-center rounded-full border border-border bg-background text-xs font-bold text-foreground/70 transition-colors hover:border-[var(--brand-blue)] hover:text-[var(--brand-blue)]"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {col.title}
              </p>
              <ul className="flex flex-col gap-2.5" role="list">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/70 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <Image
              src="/placeholder-logo.png"
              alt="TogetLink logo"
              width={24}
              height={24}
              className="size-6 rounded-lg object-contain"
            />
            <span className="text-sm font-semibold text-foreground">TogetLink</span>
            <span className="text-sm text-muted-foreground">
              · © 2026 Aeternexus Inc. All rights reserved.
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms
            </a>
            <a
              href="mailto:info@aeternexus.com"
              className="transition-colors hover:text-[var(--brand-blue)]"
            >
              info@aeternexus.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
