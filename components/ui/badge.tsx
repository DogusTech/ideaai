import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Fluent-inspired badge. Used for categories, demo/live status, Pro, and
 * privacy-safe labels. Status is never conveyed by color alone — each variant
 * pairs with an icon or text in usage.
 */
const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium whitespace-nowrap",
  {
    variants: {
      variant: {
        neutral: "border-border bg-secondary text-secondary-foreground",
        category: "border-brand-blue/20 bg-brand-surface text-brand-blue",
        demo: "border-brand-muted/30 bg-brand-warm text-[#6b5a44]",
        live: "border-brand-green/30 bg-brand-green/10 text-[#2f6b47]",
        pro: "border-brand-yellow/40 bg-brand-yellow/15 text-[#8a5a0c]",
        privacy: "border-brand-blue/20 bg-brand-blue/5 text-brand-blue",
        outline: "border-border bg-transparent text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
)

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
