"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { Terminal as XtermTerminal } from "xterm"
import type { FitAddon as XtermFitAddon } from "xterm-addon-fit"
import { AgentBridge } from "@/app/utils/agent-bridge"

type TerminalTab = { id: string; label: string }

export function IntegratedTerminalPanel({ cwd, workspaceRoot, shell = "PowerShell", fontSize = 13, onClose }: { cwd?: string; workspaceRoot?: string; shell?: string; fontSize?: number; onClose: () => void }) {
  const [tabs, setTabs] = useState<TerminalTab[]>([{ id: "default", label: "Terminal 1" }])
  const [activeId, setActiveId] = useState("default")
  const hostRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<XtermTerminal | null>(null)
  const fitRef = useRef<XtermFitAddon | null>(null)
  const folderName = (cwd || workspaceRoot)?.split(/[\\/]/).filter(Boolean).pop() || "workspace"

  useEffect(() => {
    const host = hostRef.current
    if (!host) return
    let disposed = false
    let observer: ResizeObserver | null = null
    let dataSubscription: { dispose: () => void } | null = null
    let unsubscribe: () => void = () => {}
    let frame = 0
    void (async () => {
      const [{ Terminal }, { FitAddon }] = await Promise.all([import("xterm"), import("xterm-addon-fit")])
      if (disposed || !host.isConnected) return
      const terminal = new Terminal({
        cursorBlink: true,
        fontFamily: "'Google Sans Code', 'Cascadia Code', Consolas, monospace",
        fontSize,
        lineHeight: 1.35,
        scrollback: 5000,
        convertEol: false,
        theme: {
          background: "#ffffff", foreground: "#111111", cursor: "#000000",
          cursorAccent: "#ffffff", selectionBackground: "#e5e5e5",
          black: "#111111", red: "#555555", green: "#444444", yellow: "#666666",
          blue: "#333333", magenta: "#777777", cyan: "#555555", white: "#eeeeee",
          brightBlack: "#666666", brightRed: "#555555", brightGreen: "#444444", brightYellow: "#666666",
          brightBlue: "#333333", brightMagenta: "#777777", brightCyan: "#555555", brightWhite: "#ffffff",
        },
      })
      const fit = new FitAddon()
      terminal.loadAddon(fit)
      terminal.open(host)
      terminalRef.current = terminal
      fitRef.current = fit
      const resize = () => {
        try { fit.fit(); AgentBridge.resizeTerminal(terminal.cols, terminal.rows, activeId) } catch {}
      }
      observer = new ResizeObserver(resize)
      observer.observe(host)
      dataSubscription = terminal.onData((data) => AgentBridge.writeTerminal(data, activeId))
      unsubscribe = AgentBridge.onTerminalData(({ id, data }) => {
        if (id === activeId) terminal.write(data)
      })
      terminal.focus()
      frame = requestAnimationFrame(resize)
      void AgentBridge.startTerminal({ id: activeId, cwd: cwd || workspaceRoot, workspaceRoot, shell }).then((result: any) => {
        if (disposed) return
        if (!result?.success) terminal.write(`\r\nTerminal could not start: ${result?.error || "unknown error"}\r\n`)
        else if (result.initialOutput) terminal.write(result.initialOutput)
        requestAnimationFrame(resize)
      })
    })().catch((error) => {
      if (!disposed) host.textContent = `Terminal failed to initialize: ${error instanceof Error ? error.message : "unknown error"}`
    })
    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      observer?.disconnect()
      dataSubscription?.dispose()
      unsubscribe()
      terminalRef.current?.dispose()
      terminalRef.current = null
      fitRef.current = null
    }
  }, [activeId, cwd, workspaceRoot, fontSize, shell])

  const createTab = useCallback(() => {
    setTabs((previous) => {
      const id = `terminal-${Date.now()}`
      const next = [...previous, { id, label: `Terminal ${previous.length + 1}` }]
      setActiveId(id)
      return next
    })
  }, [])

  const closeActiveTab = async () => {
    await AgentBridge.closeTerminal(activeId)
    if (tabs.length === 1) { onClose(); return }
    const next = tabs.filter((tab) => tab.id !== activeId)
    setTabs(next)
    setActiveId(next[0].id)
  }

  return (
    <section data-research-lab className="overflow-hidden rounded-md border border-hairline bg-paper text-obsidian" aria-label="Integrated terminal">
      <div className="flex h-10 items-center justify-between border-b border-hairline bg-white/80 px-3 text-obsidian backdrop-blur-md">
        <div className="flex min-w-0 items-center gap-1">
          {tabs.map((tab) => <button key={tab.id} onClick={() => setActiveId(tab.id)} className={`max-w-48 truncate rounded-full px-3 py-1 text-[11px] ${activeId === tab.id ? "bg-ash text-obsidian" : "text-graphite hover:bg-ash"}`}><span className="mr-1.5">›_</span>{folderName}</button>)}
        </div>
        <div className="flex items-center gap-1">
          <button onClick={createTab} aria-label="New terminal tab" title="New terminal" className="grid h-7 w-7 place-items-center rounded-full text-graphite hover:bg-ash">＋</button>
          <button onClick={closeActiveTab} aria-label="Close terminal" title="Close terminal" className="grid h-7 w-7 place-items-center rounded-full text-graphite hover:bg-ash">×</button>
        </div>
      </div>
      <div ref={hostRef} className="h-52 w-full bg-paper px-3 py-2" />
    </section>
  )
}
