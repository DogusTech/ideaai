import type { ReactNode } from "react"

export type EmptyStateProps = {
  icon?: ReactNode
  title: string
  description?: string
  children?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  children,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center ${className}`}
    >
      {icon && (
        <div className="mb-5 flex size-14 items-center justify-center rounded-2xl bg-brand-surface text-brand-blue">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children && <div className="mt-6">{children}</div>}
    </div>
  )
}
