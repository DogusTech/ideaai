import { Navbar } from "@/components/hero/navbar"
import { Hero } from "@/components/hero/hero"
import { SiteFooter } from "@/components/site/site-footer"

export default function Page() {
  return (
    <div className="relative min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
      </main>
      <SiteFooter />
    </div>
  )
}
