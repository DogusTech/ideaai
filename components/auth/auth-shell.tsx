import type { ReactNode } from "react"
import Link from "next/link"
import { ShieldCheck, MapPin, Users, LucideIcon } from "lucide-react"

export type TrustPoint = {
  icon: LucideIcon | any
  title: string
  description: string
}

export type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
  sideTitle?: string
  sidePoints?: TrustPoint[]
  sideLogoText?: ReactNode
}

const DEFAULT_TRUST_POINTS: TrustPoint[] = [
  {
    icon: MapPin,
    title: "Discover nearby hubs",
    description: "Find professional spaces and meetups happening around you.",
  },
  {
    icon: Users,
    title: "Meet with intent",
    description: "Connect with people who share your goals and industry.",
  },
  {
    icon: ShieldCheck,
    title: "Trust-first by design",
    description: "Consent-based networking that respects your boundaries.",
  },
]

export function AuthShell({ 
  title, 
  subtitle, 
  children, 
  footer, 
  sideTitle = "Build trusted professional connections in real-world places.",
  sidePoints = DEFAULT_TRUST_POINTS,
  sideLogoText = "TogetLink"
}: AuthShellProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Brand / trust panel */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-brand-surface to-brand-warm/60 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center bg-[#0543B8] text-white font-black text-2xl leading-none">
            TL
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground">
            {sideLogoText}
          </span>
        </Link>

        <div>
          <h2 className="max-w-md text-balance text-3xl font-bold leading-tight tracking-tight text-foreground">
            {sideTitle}
          </h2>
          <ul className="mt-10 flex flex-col gap-6">
            {sidePoints.map((point) => (
              <li key={point.title} className="flex items-start gap-4">
                <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-background/70 text-brand-blue">
                  <point.icon className="size-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-semibold text-foreground">{point.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-foreground/60">
          A product by Aeternexus Inc.
        </p>
      </aside>

      {/* Form panel */}
      <div className="flex flex-col bg-background">
        <div className="flex items-center justify-between px-5 py-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center bg-[#0543B8] text-white font-black text-xl leading-none">
              TL
            </span>
            <span className="text-xl font-bold tracking-tight text-foreground">
              TogetLink
            </span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 lg:px-12">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {title}
            </h1>
            <p className="mt-2 text-pretty text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
            <div className="mt-8 text-center text-sm text-muted-foreground">
              {footer}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
