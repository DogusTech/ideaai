import type { Metadata } from "next"
import PitchDeckClient from "./deck-client"

export const metadata: Metadata = {
  title: "TogetLink IdeaAI | BİGG Jüri Sunumu",
  description: "İTÜ Çekirdek BİGG ön değerlendirme jürisi için dört dakikalık interaktif sunum.",
}

export default function PitchDeckPage() {
  return <PitchDeckClient />
}
