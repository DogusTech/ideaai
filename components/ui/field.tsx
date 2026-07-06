import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react"

const baseControl =
  "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/15 aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/15"

export function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string
  children: ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-sm font-medium text-foreground"
    >
      {children}
    </label>
  )
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p className="mt-1.5 text-sm text-destructive" role="alert">
      {children}
    </p>
  )
}

type TextFieldProps = {
  label: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

export function TextField({ label, error, id, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <input
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={baseControl}
        {...props}
      />
      <FieldError>{error}</FieldError>
    </div>
  )
}

type TextAreaFieldProps = {
  label: string
  error?: string
} & TextareaHTMLAttributes<HTMLTextAreaElement>

export function TextAreaField({
  label,
  error,
  id,
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")
  return (
    <div>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <textarea
        id={fieldId}
        aria-invalid={error ? true : undefined}
        className={`${baseControl} min-h-32 resize-y`}
        {...props}
      />
      <FieldError>{error}</FieldError>
    </div>
  )
}
