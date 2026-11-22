"use client"

export type PlanStep = { id: string; title: string; state: "pending" | "running" | "completed" }
export type WorkspaceChange = { path: string; before: string | null; after: string; additions: number; deletions: number; reverted?: boolean }

function lineDiff(before: string | null, after: string) {
  const oldLines = before?.split("\n") || []
  const newLines = after.split("\n")
  if (oldLines.length * newLines.length > 1_000_000) {
    let prefix = 0
    while (prefix < oldLines.length && prefix < newLines.length && oldLines[prefix] === newLines[prefix]) prefix++
    let oldEnd = oldLines.length
    let newEnd = newLines.length
    while (oldEnd > prefix && newEnd > prefix && oldLines[oldEnd - 1] === newLines[newEnd - 1]) { oldEnd--; newEnd-- }
    return [
      ...oldLines.slice(0, prefix).map((text) => ({ kind: "same" as const, text })),
      ...oldLines.slice(prefix, oldEnd).map((text) => ({ kind: "remove" as const, text })),
      ...newLines.slice(prefix, newEnd).map((text) => ({ kind: "add" as const, text })),
      ...oldLines.slice(oldEnd).map((text) => ({ kind: "same" as const, text })),
    ]
  }
  const width = newLines.length + 1
  const matrix = new Uint16Array((oldLines.length + 1) * width)
  for (let oldIndex = oldLines.length - 1; oldIndex >= 0; oldIndex--) {
    for (let newIndex = newLines.length - 1; newIndex >= 0; newIndex--) {
      const cell = oldIndex * width + newIndex
      matrix[cell] = oldLines[oldIndex] === newLines[newIndex]
        ? matrix[(oldIndex + 1) * width + newIndex + 1] + 1
        : Math.max(matrix[(oldIndex + 1) * width + newIndex], matrix[oldIndex * width + newIndex + 1])
    }
  }
  const rows: Array<{ kind: "add" | "remove" | "same"; text: string }> = []
  let oldIndex = 0
  let newIndex = 0
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (oldIndex < oldLines.length && newIndex < newLines.length && oldLines[oldIndex] === newLines[newIndex]) {
      rows.push({ kind: "same", text: oldLines[oldIndex++] }); newIndex++
    } else if (newIndex < newLines.length && (oldIndex >= oldLines.length || matrix[oldIndex * width + newIndex + 1] >= matrix[(oldIndex + 1) * width + newIndex])) {
      rows.push({ kind: "add", text: newLines[newIndex++] })
    } else {
      rows.push({ kind: "remove", text: oldLines[oldIndex++] })
    }
  }
  return rows
}

export function WorkspaceInspector({
  tab, onTabChange, steps, changes, onRevert, onAccept,
}: {
  tab: "plan" | "changes"
  onTabChange: (tab: "plan" | "changes") => void
  steps: PlanStep[]
  changes: WorkspaceChange[]
  onRevert: (change: WorkspaceChange) => void
  onAccept: (path: string) => void
}) {
  const current = changes.filter((change) => !change.reverted)
  const diffs = current.map((change) => ({ change, rows: lineDiff(change.before, change.after) }))
  const added = diffs.reduce((sum, item) => sum + item.rows.filter((row) => row.kind === "add").length, 0)
  const removed = diffs.reduce((sum, item) => sum + item.rows.filter((row) => row.kind === "remove").length, 0)
  return <aside className="ideaai-panel flex h-full w-[min(390px,34vw)] min-w-[320px] shrink-0 flex-col">
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-[var(--workspace-border)] px-4">
      <div className="flex items-center gap-1 rounded-full bg-[#222222] p-1">
        <button onClick={() => onTabChange("plan")} className={`rounded-full px-3 py-1.5 text-[11px] ${tab === "plan" ? "bg-[#303030] text-[#f5f5f5] ring-1 ring-[#404040]" : "text-[#9ca3af]"}`}>Implementation Plan</button>
        <button onClick={() => onTabChange("changes")} className={`rounded-full px-3 py-1.5 text-[11px] ${tab === "changes" ? "bg-[#303030] text-[#f5f5f5] ring-1 ring-[#404040]" : "text-[#9ca3af]"}`}>Changes</button>
      </div>
      <span className="text-[10px] text-[#999ca2]">{tab === "plan" ? `${steps.length} steps` : `${current.length} files`}</span>
    </div>
    {tab === "plan" ? <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <p className="ideaai-subtle-text text-[10px] font-semibold uppercase tracking-[0.14em]">Execution roadmap</p>
      <h2 className="mt-2 text-lg font-semibold tracking-tight text-[var(--workspace-text)]">Implementation plan</h2>
      {steps.length ? <ol className="mt-5 space-y-2">
        {steps.map((step, index) => <li key={step.id} className="ideaai-panel-muted flex gap-3 rounded-xl border p-3">
          <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] ${step.state === "completed" ? "bg-[#e9eef5] text-[#4c5b6d]" : step.state === "running" ? "bg-[#ececf0] text-[#303238]" : "bg-[#f3f3f5] text-[#9a9da3]"}`}>{step.state === "completed" ? "✓" : index + 1}</span>
          <span className="min-w-0 flex-1"><span className="block text-[12px] leading-5 text-[var(--workspace-text)]">{step.title}</span><span className="ideaai-subtle-text mt-1 block text-[10px] capitalize">{step.state}</span></span>
        </li>)}
      </ol> : <div className="mt-5 rounded-xl border border-dashed border-[#3a3a3a] bg-[#202020] p-4 text-xs leading-5 text-[#9ca3af]">Send a request to see the agent’s execution plan here.</div>}
    </div> : <div className="min-h-0 flex-1 overflow-y-auto p-5">
      <div className="flex items-end justify-between"><div><p className="ideaai-subtle-text text-[10px] font-semibold uppercase tracking-[0.14em]">Working tree</p><h2 className="mt-2 text-lg font-semibold tracking-tight text-[var(--workspace-text)]">File changes</h2></div><span className="text-xs tabular-nums"><b className="font-medium text-[#8fbc9b]">+{added}</b><span className="px-1 text-[#666]">·</span><b className="font-medium text-[#9ca3af]">−{removed}</b></span></div>
      {current.length ? <div className="mt-5 space-y-3">{diffs.map(({ change, rows }) => <details key={change.path} open className="ideaai-panel-muted overflow-hidden rounded-xl border">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-3 text-[11px]"><span className="min-w-0 flex-1 truncate font-medium text-[#383a40]">{change.path}</span><span className="shrink-0 tabular-nums text-[#718276]">+{rows.filter((row) => row.kind === "add").length}</span><span className="shrink-0 tabular-nums text-[#898b91]">−{rows.filter((row) => row.kind === "remove").length}</span></summary>
        <pre aria-label={`Diff for ${change.path}`} className="max-h-60 overflow-auto border-t border-black/[0.05] bg-[#f8f8f9] p-3 text-[10px] leading-5 text-[#51545b]">{rows.slice(0, 260).map((row, index) => <span key={`${index}-${row.kind}`} className={`block whitespace-pre ${row.kind === "add" ? "bg-[#eef4ef] text-[#49634f]" : row.kind === "remove" ? "bg-[#f7eeee] text-[#8a5e5e]" : "text-[#777b82]"}`}><i className="mr-2 inline-block w-3 text-right not-italic opacity-60">{row.kind === "add" ? "+" : row.kind === "remove" ? "−" : " "}</i>{row.text || " "}</span>)}</pre>
        <div className="flex justify-end gap-2 border-t border-black/[0.05] p-2"><button type="button" onClick={() => onRevert(change)} className="rounded-full px-3 py-1.5 text-[10px] text-[#777] hover:bg-[#f4f4f5]">Revert</button><button type="button" onClick={() => onAccept(change.path)} className="rounded-full bg-[#202124] px-3 py-1.5 text-[10px] text-white">Accept</button></div>
      </details>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-[#3a3a3a] bg-[#202020] p-4 text-xs leading-5 text-[#9ca3af]">File edits made by the agent will appear here with real line counts and revert controls.</div>}
    </div>}
  </aside>
}
