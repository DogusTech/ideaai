import type { SVGProps } from "react"

/** The Turaen arch mark. It intentionally inherits color from its parent. */
export function TuraenLogo({
  className,
  title = "Turaen",
  ...props
}: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 512 512"
      fill="none"
      role="img"
      aria-label={title}
      className={className}
      {...props}
    >
      <path
        d="M112 348C138 282 163 168 256 168s118 114 144 180"
        stroke="currentColor"
        strokeWidth="76"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
