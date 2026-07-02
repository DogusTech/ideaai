import Link from "next/link"

type Tab = {
  label: string
  href?: string
}

const TABS: Tab[] = [
  { label: "Overview" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Service", href: "/terms-of-service" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Technologies" },
  { label: "FAQ" },
]

export function LegalTabs({ active }: { active: string }) {
  return (
    <nav
      aria-label="Legal sections"
      className="border-b border-border/70 bg-background"
    >
      <div className="mx-auto max-w-[1200px] px-5 lg:px-8">
        <ul className="-mb-px flex gap-1 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = tab.label === active
            const className = `inline-flex shrink-0 items-center whitespace-nowrap border-b-2 px-4 py-4 text-sm font-medium transition-colors ${
              isActive
                ? "border-brand-blue text-brand-blue"
                : "border-transparent text-muted-foreground"
            }`

            if (!tab.href) {
              return (
                <li key={tab.label}>
                  <span
                    aria-disabled="true"
                    title="Coming soon"
                    className={`${className} cursor-not-allowed opacity-50`}
                  >
                    {tab.label}
                  </span>
                </li>
              )
            }

            return (
              <li key={tab.label}>
                <Link
                  href={tab.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`${className} hover:text-foreground`}
                >
                  {tab.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
