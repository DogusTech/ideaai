import Link from "next/link"

const NAV_LINKS = [
  { label: "Explore", href: "/explore" },
  { label: "Blog", href: "/explore#guides" },
  { label: "Pricing", href: "/#pricing" },
]

/**
 * Static header for application-style pages (Explore, hub detail).
 * The animated landing navbar lives separately in components/hero/navbar.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <nav className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-xl bg-brand-blue text-white">
            <span className="size-3 rounded-full bg-white" aria-hidden="true" />
          </span>
          <span className="text-lg font-bold tracking-tight text-foreground">
            togetlink
          </span>
        </Link>

        <ul className="hidden items-center gap-8 md:flex">
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

        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:inline"
          >
            Sign in
          </Link>
          <Link
            href="#"
            className="inline-flex h-9 items-center justify-center rounded-full bg-brand-blue px-5 text-sm font-semibold text-white transition-colors hover:bg-[#2569cc] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  )
}
