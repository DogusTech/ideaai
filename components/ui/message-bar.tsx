import { Info, ShieldCheck, TriangleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

type MessageBarKind = "info" | "privacy" | "warning"

const KIND_META: Record<
  MessageBarKind,
  { icon: typeof Info; className: string; iconClassName: string }
> = {
  info: {
    icon: Info,
    className: "border-brand-blue/20 bg-brand-surface/60 text-foreground",
    iconClassName: "text-brand-blue",
  },
  privacy: {
    icon: ShieldCheck,
    className: "border-brand-green/25 bg-brand-green/8 text-foreground",
    iconClassName: "text-brand-green",
  },
  warning: {
    icon: TriangleAlert,
    className: "border-brand-yellow/30 bg-brand-yellow/10 text-foreground",
    iconClassName: "text-[#8a5a0c]",
  },
}

/**
 * Fluent MessageBar-inspired status/guidance strip. Status is signalled by an
 * icon + text, not color alone, for accessibility.
 */
export function MessageBar({
  kind = "info",
  children,
  className,
  role = "status",
}: {
  kind?: MessageBarKind
  children: React.ReactNode
  className?: string
  role?: "status" | "alert"
}) {
  const meta = KIND_META[kind]
  const Icon = meta.icon
  return (
    <div
      role={role}
      className={cn(
        "flex items-start gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm leading-relaxed",
        meta.className,
        className,
      )}
    >
      <Icon className={cn("mt-0.5 size-4 shrink-0", meta.iconClassName)} aria-hidden="true" />
      <span>{children}</span>
    </div>
  )
}
