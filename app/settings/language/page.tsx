import type { Metadata } from "next"
import { LanguageSettings } from "@/components/settings/language-settings"

export const metadata: Metadata = {
  title: "Language Settings — TogetLink",
  description: "Change your interface language.",
}

export default function LanguagePage() {
  return <LanguageSettings />
}
