"use client"

import { useState } from "react"
import { Check, Globe } from "lucide-react"

const LANGUAGES = [
  { code: "en", name: "English", region: "US" },
  { code: "tr", name: "Türkçe", region: "Turkey" },
  { code: "es", name: "Español", region: "Spain" },
  { code: "fr", name: "Français", region: "France" },
  { code: "de", name: "Deutsch", region: "Germany" },
]

export function LanguageSettings() {
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setShowSuccess(false)
    setTimeout(() => {
      setIsSaving(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Globe className="size-5 text-brand-blue" />
          Language Preferences
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the language you want to use for the TogetLink interface.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLanguage === lang.code
          return (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex items-center justify-between rounded-xl border ${isSelected ? 'border-brand-blue bg-brand-blue/5' : 'border-[#e5e5e5] bg-white'} p-4 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-blue`}
            >
              <div className="flex flex-col items-start">
                <span className={`font-semibold ${isSelected ? 'text-brand-blue' : 'text-foreground'}`}>
                  {lang.name}
                </span>
                <span className="text-xs text-muted-foreground">{lang.region}</span>
              </div>
              <div className={`flex size-5 items-center justify-center rounded-full border ${isSelected ? 'border-brand-blue bg-brand-blue' : 'border-[#d6d6d6] bg-transparent'}`}>
                {isSelected && <Check className="size-3 text-white" />}
              </div>
            </button>
          )
        })}
      </div>

      <div className="flex items-center justify-between border-t border-[#e5e5e5] pt-6">
        <span className={`text-sm text-brand-green transition-opacity ${showSuccess ? 'opacity-100' : 'opacity-0'}`}>
          Preferences saved successfully!
        </span>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="rounded-xl bg-brand-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-blue/90 disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
