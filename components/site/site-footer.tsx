import Link from "next/link"

const FOOTER_GROUPS = [
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Founder", href: "/founder" },
      { label: "Press", href: "/press" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Contact", href: "/contact" },
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-[1200px] px-5 py-14 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-brand-blue text-white">
                <span className="size-3 rounded-full bg-white" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">
                togetlink
              </span>
            </Link>
            <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground">
              A professional real-world networking platform by Aeternexus Inc.
              Discover nearby hubs, meet with intent, and build trusted
              professional connections.
            </p>
          </div>

          {FOOTER_GROUPS.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h3 className="text-sm font-semibold text-foreground">
                {group.title}
              </h3>
              <ul className="mt-4 flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-border/70 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-muted-foreground">
            © 2026 Aeternexus Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/terms-of-use"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Use
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
