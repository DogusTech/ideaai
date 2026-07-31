import { HeroSection } from "@/components/ai-landing/HeroSection"
import { FeatureScrollReveal } from "@/components/ai-landing/FeatureScrollReveal"
import { DepartmentVideoGrid } from "@/components/ai-landing/DepartmentVideoGrid"

export const metadata = {
  title: "TogetLink IdeaAI 2.0 | Yeni Nesil Yapay Zeka Asistanınız",
  description: "TogetLink IdeaAI ile pazarlama, büyüme, SEO ve yazılım süreçlerinizi tek platformdan yönetin.",
}

export default function AILandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#fafafa]">
      <HeroSection />
      <FeatureScrollReveal />
      <DepartmentVideoGrid />
    </main>
  )
}
