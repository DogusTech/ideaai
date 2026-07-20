import React, { type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p className="mt-1.5 text-xs text-destructive" role="alert">
      {children}
    </p>
  )
}

type TextFieldProps = {
  label: string
  error?: string
  leftIcon?: ReactNode
} & InputHTMLAttributes<HTMLInputElement>

export function TextField({ label, error, leftIcon, id, className, required, ...props }: TextFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")
  
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </div>
        )}
        <input
          id={fieldId}
          aria-invalid={error ? true : undefined}
          required={required}
          className={cn(
            "peer w-full rounded-md border border-input bg-transparent py-3 text-sm text-foreground outline-none transition-all placeholder-transparent focus:border-2 focus:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
            leftIcon ? "pl-10 pr-4" : "px-4"
          )}
          placeholder={props.placeholder || label}
          {...props}
        />
        <label
          htmlFor={fieldId}
          className={cn(
            "pointer-events-none absolute bg-background px-1 text-xs text-muted-foreground transition-all",
            "peer-placeholder-shown:text-sm",
            "peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-brand-blue peer-aria-[invalid=true]:text-destructive",
            "-top-2.5 left-3",
            "peer-placeholder-shown:top-[13px]",
            leftIcon ? "peer-placeholder-shown:left-10" : "peer-placeholder-shown:left-3"
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      </div>
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
  className,
  required,
  ...props
}: TextAreaFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")
  
  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <textarea
          id={fieldId}
          aria-invalid={error ? true : undefined}
          required={required}
          className="peer w-full min-h-[120px] resize-y rounded-md border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-all placeholder-transparent focus:border-2 focus:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive"
          placeholder={props.placeholder || label}
          {...props}
        />
        <label
          htmlFor={fieldId}
          className="pointer-events-none absolute -top-2.5 left-3 bg-background px-1 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-[13px] peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-brand-blue peer-aria-[invalid=true]:text-destructive"
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      </div>
      <FieldError>{error}</FieldError>
    </div>
  )
}

type SelectFieldProps = {
  label: string
  error?: string
  options: { label: string; value: string }[]
} & SelectHTMLAttributes<HTMLSelectElement>

export function SelectField({
  label,
  error,
  id,
  options,
  className,
  required,
  ...props
}: SelectFieldProps) {
  const fieldId = id ?? props.name ?? label.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative">
        <select
          id={fieldId}
          aria-invalid={error ? true : undefined}
          required={required}
          className={cn(
            "peer w-full appearance-none rounded-md border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-all focus:border-2 focus:border-brand-blue disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
            !props.value && "text-transparent focus:text-foreground", // Hide selected text if empty, but keep for label logic
            props.value && "text-foreground"
          )}
          {...props}
        >
          <option value="" disabled hidden></option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-foreground">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-muted-foreground peer-focus:text-brand-blue">
          <ChevronDown className="size-4" />
        </div>
        <label
          htmlFor={fieldId}
          className={cn(
            "pointer-events-none absolute -top-2.5 left-3 bg-background px-1 text-xs transition-all",
            !props.value ? "top-[13px] text-sm text-muted-foreground" : "text-muted-foreground",
            "peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-brand-blue peer-aria-[invalid=true]:text-destructive"
          )}
        >
          {label}
          {required && <span className="ml-0.5 text-destructive">*</span>}
        </label>
      </div>
      <FieldError>{error}</FieldError>
    </div>
  )
}
