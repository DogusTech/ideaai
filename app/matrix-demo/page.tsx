import type { Metadata } from "next"

import CodexTemplate from "../../public/matrix-demo/codex-template"

export const metadata: Metadata = {
  title: "IdeaAI - Autonomous AI Coding Agent & Engineering Workspace",
  description:
    "IdeaAI is the autonomous desktop engineering workspace that ships while you sleep.",
}

export default function MatrixDemoLandingPage() {
  return <CodexTemplate />
}
