import { Info } from "lucide-react"

import { cn } from "@/lib/utils"

/**
 * Fluent InfoLabel-inspired label with an inline hint, used for privacy
 * explanations next to fields and sections.
 */
export function InfoLabel({
  label,
  hint,
  htmlFor,
  className,
}: {
  label: string
  hint?: string
  htmlFor?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground"
      >
        {label}
        {hint && <Info className="size-3.5 text-muted-foreground" aria-hidden="true" />}
      </label>
      {hint && <span className="text-xs leading-relaxed text-muted-foreground">{hint}</span>}
    </div>
  )
}
