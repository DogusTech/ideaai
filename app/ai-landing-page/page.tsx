import { AntigravityHero } from "@/components/ai-landing/AntigravityHero"
import { FloatingWavyIcons } from "@/components/ai-landing/FloatingWavyIcons"
import { TypewriterStatement } from "@/components/ai-landing/TypewriterStatement"
import { FeatureSplitSection } from "@/components/ai-landing/FeatureSplitSection"
import { DeveloperVideos } from "@/components/ai-landing/DeveloperVideos"
import { ParticleActionCards } from "@/components/ai-landing/ParticleActionCards"
import { BlogsAndFooter } from "@/components/ai-landing/BlogsAndFooter"

export const metadata = {
  title: "TogetLink IdeaAI 2.0 | Next-gen agent platform",
  description: "Experience liftoff with TogetLink IdeaAI, our agentic development platform.",
}

export default function AILandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-white">
      <AntigravityHero />
      <FloatingWavyIcons />
      <TypewriterStatement />
      <FeatureSplitSection />
      <DeveloperVideos />
      <ParticleActionCards />
      <BlogsAndFooter />
    </main>
  )
}
