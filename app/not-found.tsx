import Link from "next/link"
import { Compass } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-sm flex-col items-center">
        <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-brand-blue/10">
          <Compass className="size-8 text-brand-blue" strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          It looks like you've ventured off the map. The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-10">
          <Link
            href="/app"
            className="inline-flex items-center justify-center rounded-full bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue focus-visible:ring-offset-2"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
