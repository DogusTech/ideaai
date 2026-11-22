"use client"

import { useState } from "react"

type Props = {
  projectName?: string | null
  inspectorOpen: boolean
  onToggleSidebar: () => void
  onToggleInspector: () => void
}

export function DesktopTitlebar({ projectName, inspectorOpen, onToggleSidebar, onToggleInspector }: Props) {
  const [maximized, setMaximized] = useState(false)
  const callWindow = (channel: string) => {
    const bridge = (window as Window & { electronAPI?: { invoke: (name: string) => Promise<unknown> } }).electronAPI
    if (!bridge) return
    void bridge.invoke(channel).then((result) => {
      if (channel === "window:toggle-maximize") setMaximized(Boolean(result))
    }).catch(() => undefined)
  }

  return <header className="desktop-titlebar flex h-[38px] shrink-0 items-center gap-2 border-b border-[#e0e0e0] dark:border-[#222222] bg-white dark:bg-[#0a0a0a] px-2 text-[12px] text-[#666666] dark:text-[#999999]">
    <button type="button" onClick={onToggleSidebar} className="titlebar-control" aria-label="Toggle sidebar" title="Toggle sidebar"><svg viewBox="0 0 20 20" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2.5" y="3" width="15" height="14" rx="3"/><path d="M7 3v14"/></svg></button>
    <button type="button" className="titlebar-control" aria-label="Go back" onClick={() => history.back()} title="Back">←</button>
    <button type="button" className="titlebar-control" aria-label="Go forward" onClick={() => history.forward()} title="Forward">→</button>
    <div className="ml-2 min-w-0 flex-1 truncate text-[11px] text-[#666666] dark:text-[#999999]">Turaen <span className="mx-1.5">/</span> {projectName || "Workspace"}</div>
    <button type="button" onClick={onToggleInspector} className={`titlebar-control ${inspectorOpen ? "bg-black/[0.05] dark:bg-white/[0.1]" : ""}`} aria-label="Toggle inspector" title="Toggle inspector">☷</button>
    <div className="ml-1 flex h-full items-stretch" aria-label="Window controls">
      <button type="button" onClick={() => callWindow("window:minimize")} className="window-control" aria-label="Minimize">−</button>
      <button type="button" onClick={() => callWindow("window:toggle-maximize")} className="window-control" aria-label={maximized ? "Restore" : "Maximize"}>{maximized ? "❐" : "□"}</button>
      <button type="button" onClick={() => callWindow("window:close")} className="window-control window-close" aria-label="Close">×</button>
    </div>
  </header>
}
