import type { Metadata } from "next"
import Script from "next/script"

import CodexTemplate from "../../public/matrix-demo/codex-template"

export const metadata: Metadata = {
  title: "IdeaAI - Autonomous AI Coding Agent & Engineering Workspace",
  description:
    "IdeaAI is the autonomous desktop engineering workspace that ships while you sleep.",
}

export default function MatrixDemoLandingPage() {
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": "https://ideaai.togetlink.com/#software",
    name: "IdeaAI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Windows 10, Windows 11",
    description:
      "IdeaAI is an autonomous Windows desktop engineering workspace with local Ollama execution, terminal automation, filesystem tools, and cloud-controlled overnight workflows.",
    url: "https://ideaai.togetlink.com",
    downloadUrl: "https://apps.microsoft.com/detail/9p9sfwqgbsk7",
    installUrl: "https://apps.microsoft.com/detail/9p9sfwqgbsk7",
    publisher: {
      "@type": "Organization",
      name: "Aeternexus, Inc.",
      url: "https://ideaai.togetlink.com",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  }

  return (
    <>
      <Script
        id="ideaai-software-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <CodexTemplate />
    </>
  )
}
