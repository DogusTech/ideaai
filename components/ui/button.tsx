import * as React from "react"

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className = "", type = "button", ...props },
  ref,
) {
  return <button ref={ref} type={type} className={`rounded-full ${className}`} {...props} />
})
