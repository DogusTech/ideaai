import Link from "next/link"

const FOOTER_COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Discover hubs", href: "/#places" },
      { label: "Plans", href: "/#plans" },
      { label: "Register", href: "/register" },
      { label: "Login", href: "/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About TogetLink", href: "/about" },
      { label: "Founder", href: "/founder" },
      { label: "Blog", href: "/blog" },
      { label: "Press", href: "/press" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Trust",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      { label: "Terms of Use", href: "/terms-of-use" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Support", href: "/contact" },
      { label: "Community", href: "/#places" },
    ],
  },
]

// Inline SVG icon placeholders — no social accounts exist yet
function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.402 6.231H2.742l7.726-8.835L1.254 2.25H8.08l4.253 5.622L18.243 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
    </svg>
  )
}

const SOCIAL_LINKS = [
  { label: "Follow TogetLink on X", href: "#", icon: XIcon },
  { label: "Follow TogetLink on LinkedIn", href: "#", icon: LinkedInIcon },
]

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-[#f8f9fa]">
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        {/* Follow us row */}
        <div className="flex items-center gap-4 py-5">
          <span className="text-sm font-medium text-foreground/70">
            Follow us
          </span>
          <div className="flex items-center gap-2">
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex size-9 items-center justify-center rounded-full text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <hr className="border-border/50" />

        {/* 4-column link grid */}
        <div className="grid grid-cols-2 gap-8 py-10 sm:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-4 text-sm font-semibold text-foreground">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href + link.label}>
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

        <hr className="border-border/50" />

        {/* Bottom legal bar */}
        <div className="flex flex-col items-start justify-between gap-3 py-5 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            &copy; 2026 Aeternexus Inc. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/privacy-policy"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Service
            </Link>
            <Link
              href="/terms-of-use"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Terms of Use
            </Link>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
