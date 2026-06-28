import { ShieldCheck } from "lucide-react"

const COLUMNS = [
  {
    title: "Product",
    links: ["Nearby Hubs", "Professional Signals", "Pro Membership", "Enterprise"],
  },
  {
    title: "Company",
    links: ["About", "Privacy", "Terms", "Contact"],
  },
  {
    title: "Resources",
    links: ["FAQ", "Safety", "Google Places API Ready", "Blog"],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card/40">
      <div className="mx-auto max-w-[1400px] px-6 py-16 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-brand-blue text-white">
                <span className="size-3 rounded-full bg-white" aria-hidden="true" />
              </span>
              <span className="text-lg font-bold tracking-tight text-foreground">togetlink</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              TogetLink is a real-world professional networking platform by Aeternexus Inc.
            </p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-3 py-1.5 text-xs font-medium text-brand-green">
              <ShieldCheck className="size-3.5" aria-hidden="true" />
              Privacy-safe professional discovery
            </p>
          </div>

          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-sm font-bold tracking-tight text-foreground">{col.title}</h2>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border/60 pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Aeternexus Inc. All rights reserved.</p>
          <p>Privacy-safe professional discovery for real-world collaboration.</p>
        </div>
      </div>
    </footer>
  )
}
