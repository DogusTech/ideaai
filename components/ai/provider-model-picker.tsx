"use client"

import { useEffect, useRef, useState } from "react"
import { Check, Info } from "lucide-react"

export type ModelChoice = {
  value: string
  label: string
  provider: string
  detail: string
  badge?: string
  installed?: boolean
  unavailable?: boolean
}

export function ProviderModelPicker({
  value,
  choices,
  onChange,
  onOpenManageModels,
}: {
  value: string
  choices: ModelChoice[]
  onChange: (value: string) => void
  onOpenManageModels?: () => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = choices.find((choice) => choice.value === value) || choices[0]

  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", close)
    document.addEventListener("keydown", keydown)
    return () => {
      document.removeEventListener("pointerdown", close)
      document.removeEventListener("keydown", keydown)
    }
  }, [])

  if (!selected) return null

  return (
    <div ref={rootRef} className="relative min-w-0">
      {/* Trigger Button - Minimalist Pill */}
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex max-w-[min(58vw,280px)] min-w-0 h-[32px] items-center gap-2 rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-[#ffffff] dark:bg-[#1f1f1f] px-3 text-left text-xs text-[#000000] dark:text-[#ffffff] transition-colors hover:bg-[#f5f5f5] dark:hover:bg-[#282828]"
      >
        <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#f1f1f1] dark:bg-[#333333] text-[9px] font-semibold text-[#333333] dark:text-[#e0e0e0]">
          {selected.provider.slice(0, 1)}
        </span>
        <span className="min-w-0 truncate text-[12px] font-medium text-[#000000] dark:text-[#ffffff]">
          {selected.label}
        </span>
        <svg
          className="ml-auto h-3 w-3 shrink-0 text-[#666666] dark:text-[#999999]"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {/* Floating Popover Card - Reference 5 */}
      {open && (
        <div
          role="listbox"
          className="absolute bottom-[calc(100%+8px)] right-0 z-[90] max-h-[380px] w-[320px] overflow-hidden rounded-[20px] border border-[#e0e0e0] dark:border-[#333333] bg-[#ffffff] dark:bg-[#181818] p-2 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] dark:shadow-[0px_4px_30px_rgba(0,0,0,0.5)] flex flex-col"
        >
          {/* Section Header */}
          <div className="px-3 pt-2 pb-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-[#888888] dark:text-[#888888]">
            Model
          </div>

          {/* Model Item Rows */}
          <div className="flex-1 overflow-y-auto space-y-0.5">
            {choices.map((choice) => {
              const isSelected = choice.value === value
              const isUnavailable = choice.unavailable

              return (
                <button
                  key={choice.value}
                  type="button"
                  role="option"
                  disabled={isUnavailable}
                  aria-selected={isSelected}
                  onClick={() => {
                    if (!isUnavailable) {
                      onChange(choice.value)
                      setOpen(false)
                    }
                  }}
                  className={`flex w-full items-center justify-between gap-2.5 rounded-[12px] px-3 py-2 text-left transition-colors ${
                    isSelected
                      ? "bg-[#f1f1f1] dark:bg-[#262626] text-[#000000] dark:text-[#ffffff]"
                      : isUnavailable
                      ? "opacity-50 cursor-not-allowed text-[#888888]"
                      : "text-[#333333] dark:text-[#e0e0e0] hover:bg-[#f8f8f8] dark:hover:bg-[#222222]"
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-medium leading-none">
                        {choice.label}
                      </span>
                      {choice.badge && (
                        <span className="rounded-full bg-black/5 dark:bg-white/10 px-1.5 py-0.5 text-[9px] font-medium text-[#666666] dark:text-[#aaaaaa]">
                          {choice.badge}
                        </span>
                      )}
                    </div>
                    <span className="mt-0.5 block truncate text-[11px] text-[#888888] dark:text-[#777777]">
                      {choice.detail}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isUnavailable ? (
                      <span className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-[#888888] bg-[#f0f0f0] dark:bg-[#242424]">
                        <Info size={10} />
                        Unavailable
                      </span>
                    ) : isSelected ? (
                      <span className="text-sm font-semibold text-[#000000] dark:text-[#ffffff]">
                        ✓
                      </span>
                    ) : null}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Bottom Divider & Action */}
          {onOpenManageModels && (
            <div className="mt-1 pt-1 border-t border-[#f0f0f0] dark:border-[#262626]">
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  onOpenManageModels()
                }}
                className="flex w-full items-center justify-between rounded-[12px] px-3 py-2 text-xs font-medium text-[#666666] dark:text-[#999999] hover:bg-[#f5f5f5] dark:hover:bg-[#222222] transition-colors"
              >
                <span>Manage Local Models / View Usage</span>
                <span>&gt;</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
