import { Navbar } from "@/components/hero/navbar"
import { Hero } from "@/components/hero/hero"

export default function Page() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />
    </main>
  )
}
