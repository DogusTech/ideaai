/**
 * Local agent replies are structured JSON steps, but compact models regularly
 * return raw JSON, fenced JSON, or JSON truncated mid-string. This module
 * extracts the step fields and guarantees that only human-readable `message`
 * text ever reaches the chat renderer.
 */

export type ParsedAgentReply = {
  thought: string
  message: string
  action: string
  brandContext: string
  planSteps: string[]
  targetPath: string
  command: string
  fileContent: string
  parsedJson: boolean
  hadAgentShape: boolean
}

export type AgentModelReply = {
  loopText: string
  parsed: ParsedAgentReply
}

export type SanitizedAgentContent = {
  content: string
  thought: string
  planSteps: string[]
  activeIndex: number
  planDone: boolean
  durationSeconds?: number
  incomplete: boolean
}

const AGENT_KEYS = ["action", "thought", "message", "plan_steps", "brand_context", "target_path", "command", "file_content"] as const

const ACTION_VALUES = new Set([
  "read_file",
  "write_file",
  "patch_file",
  "run_terminal",
  "verify",
  "final_answer",
  "create",
  "edit",
  "terminal",
  "search",
  "view",
])

const EMPTY_REPLY: ParsedAgentReply = {
  thought: "",
  message: "",
  action: "",
  brandContext: "",
  planSteps: [],
  targetPath: "",
  command: "",
  fileContent: "",
  parsedJson: false,
  hadAgentShape: false,
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : ""
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim()).filter(Boolean)
    : []
}

/** True when the text contains an agent field key, even if the JSON is broken. */
export function hasAgentShape(text: string): boolean {
  const source = String(text ?? "")
  return new RegExp(`["'](?:${AGENT_KEYS.join("|")})["']\\s*:`).test(source)
}

function stripOuterFence(text: string): string {
  const trimmed = text.trim()
  const closed = trimmed.match(/^```(?:json|JSON)?\s*([\s\S]*?)```$/i)
  if (closed) return closed[1].trim()
  return trimmed.replace(/^```(?:json|JSON)?\s*/i, "").replace(/\s*```$/, "").trim()
}

/** Reads a JSON string starting at `quoteIndex`. Handles escapes and truncation. */
function readQuotedString(source: string, quoteIndex: number): { value: string; end: number; closed: boolean } {
  const quote = source[quoteIndex] === "'" ? "'" : '"'
  let index = quoteIndex + 1
  let raw = ""
  let closed = false
  while (index < source.length) {
    const char = source[index]
    if (char === "\\") {
      const next = source[index + 1]
      if (next === undefined) {
        raw += "\\"
        index += 1
        break
      }
      raw += char + next
      index += 2
      continue
    }
    if (char === quote) {
      closed = true
      break
    }
    raw += char
    index += 1
  }
  const unescape = (input: string) =>
    input
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\\\/g, "\\")
  let value = raw
  if (quote === '"') {
    try {
      value = JSON.parse(`"${raw}"`)
    } catch {
      value = unescape(raw)
    }
  } else {
    value = unescape(raw)
  }
  return { value, end: index, closed }
}

/** Extracts a string field even when the surrounding object is truncated. */
function extractStringField(source: string, key: string): string {
  const match = new RegExp(`["']${escapeRegExp(key)}["']\\s*:\\s*["']`, "i").exec(source)
  if (!match) return ""
  return readQuotedString(source, match.index + match[0].length - 1).value
}

/** Extracts an array of strings, tolerating truncation and trailing commas. */
function extractStringArray(source: string, key: string): string[] {
  const keyMatch = new RegExp(`["']${escapeRegExp(key)}["']\\s*:\\s*\\[`, "i").exec(source)
  if (!keyMatch) return []
  let index = keyMatch.index + keyMatch[0].length
  const values: string[] = []
  while (index < source.length) {
    while (index < source.length && /[\s,]/.test(source[index])) index += 1
    if (source[index] === "]") break
    if (source[index] === '"') {
      const result = readQuotedString(source, index)
      values.push(result.value)
      index = result.end + 1
      continue
    }
    if (source[index] === "'") {
      const end = source.indexOf("'", index + 1)
      values.push(source.slice(index + 1, end < 0 ? source.length : end))
      index = end < 0 ? source.length : end + 1
      continue
    }
    const nextDelimiter = source.slice(index).search(/[,\]]/)
    if (nextDelimiter < 0) break
    index += nextDelimiter + 1
  }
  return values.map((value) => value.trim()).filter(Boolean)
}

function isTruncatedAgentJson(source: string): boolean {
  const text = stripOuterFence(String(source ?? ""))
  // Any object at the start may be a step reply that is still streaming.
  const start = /^\s*\{/.test(text)
    ? text.search(/\{/)
    : text.search(/\{\s*["']?(?:action|thought|message|plan_steps|brand_context)\b/)
  if (start < 0) return false
  let depth = 0
  let inString = false
  let escape = false
  for (const char of text.slice(start)) {
    if (inString) {
      if (escape) {
        escape = false
        continue
      }
      if (char === "\\") {
        escape = true
        continue
      }
      if (char === '"') inString = false
      continue
    }
    if (char === '"') {
      inString = true
      continue
    }
    if (char === "{") depth += 1
    else if (char === "}") depth -= 1
  }
  return depth > 0 || inString
}

function looksLikeCode(value: string): boolean {
  const lines = value.split(/\r?\n/)
  if (lines.length > 6 && /[{};]/.test(value)) return true
  return /^\s*(?:import |export |function |const |let |class |def |return )/m.test(value)
}

/** Quoted prose from a broken object, skipping keys, actions, plan steps, and file bodies. */
function recoverProse(source: string, planSteps: string[], thought: string): string {
  const skip = new Set(
    [thought, ...planSteps, ...AGENT_KEYS, ...ACTION_VALUES].map((item) => item.trim()).filter(Boolean),
  )
  return collectQuotedStrings(stripOuterFence(source))
    .map((item) => item.trim())
    .filter((item) => item.length > 20 && /\s/.test(item) && !skip.has(item) && !hasAgentShape(item) && !looksLikeCode(item))
    .join("\n\n")
    .trim()
}

function proseOutsideAgentJson(source: string): string {
  const text = stripOuterFence(source)
  const start = text.search(/\{\s*["']?(?:action|thought|message|plan_steps|brand_context)\b/)
  if (start < 0) return ""
  const before = text
    .slice(0, start)
    .replace(/```(?:json|JSON)?/gi, "")
    .replace(/^Thought for\s+\d+s\s*$/gim, "")
    .trim()
  let after = ""
  if (!isTruncatedAgentJson(text)) {
    const end = text.lastIndexOf("}")
    if (end > start) after = text.slice(end + 1).replace(/```/g, "").trim()
  }
  return [before, after]
    .filter((part) => part && !hasAgentShape(part) && !/^\s*[{[]/.test(part))
    .join("\n\n")
    .replace(/\s+/g, " ")
    .trim()
}

/** When several step objects were concatenated, keep the latest one plus any human preface. */
function focusLastAgentPayload(source: string): string {
  const pattern = /\{\s*["'](?:action|thought|message|plan_steps|brand_context)["']\s*:/g
  let lastIndex = -1
  let match: RegExpExecArray | null
  while ((match = pattern.exec(source))) lastIndex = match.index
  if (lastIndex <= 0) return source
  const before = source.slice(0, lastIndex)
  const prefaceEnd = before.indexOf("{")
  const preface = (prefaceEnd >= 0 ? before.slice(0, prefaceEnd) : before).replace(/```(?:json|JSON)?/gi, "").trim()
  const tail = source.slice(lastIndex)
  return preface && !hasAgentShape(preface) ? `${preface}\n${tail}` : tail
}

/** Collects every double-quoted string value so broken JSON can still yield prose. */
function collectQuotedStrings(source: string): string[] {
  const values: string[] = []
  let index = 0
  while (index < source.length) {
    const quote = source.indexOf('"', index)
    if (quote < 0) break
    const result = readQuotedString(source, quote)
    if (result.value) values.push(result.value)
    if (!result.closed) break
    index = result.end + 1
  }
  return values
}

function tryParseJson(text: string): Record<string, unknown> | null {
  const candidates = [text.trim(), text.trim().replace(/,\s*([}\]])/g, "$1")]
  for (const candidate of candidates) {
    try {
      const value = JSON.parse(candidate)
      if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>
    } catch { /* Try the next candidate. */ }
  }
  const start = text.indexOf("{")
  const end = text.lastIndexOf("}")
  if (start >= 0 && end > start) {
    const slice = text.slice(start, end + 1).replace(/,\s*([}\]])/g, "$1")
    try {
      const value = JSON.parse(slice)
      if (value && typeof value === "object" && !Array.isArray(value)) return value as Record<string, unknown>
    } catch { /* Fall through to tolerant extraction. */ }
  }
  return null
}

function statusForAction(action: string, target: string, command: string): string {
  switch (action) {
    case "read_file": return target ? `Read ${target}.` : "Read the relevant workspace file."
    case "write_file": return target ? `Created ${target}.` : "Created the requested file."
    case "patch_file": return target ? `Updated ${target}.` : "Updated the requested file."
    case "run_terminal": return command ? `Ran ${command}.` : "Ran the requested command."
    case "verify": return target ? `Verified ${target}.` : "Verified the workspace."
    case "final_answer": return "Completed the requested task."
    default: return ""
  }
}

function humanizeNonAgentText(value: string): string {
  let text = String(value ?? "")
  if (!text.trim()) return ""
  text = text.replace(/```(?:json|JSON)?\s*([\s\S]*?)```/g, (block, body) => hasAgentShape(String(body)) ? "" : block)
  text = text.replace(/<think>[\s\S]*?(?:<\/think>|$)/gi, " ")
  text = text.replace(/<plan_steps[\s\S]*?(?:<\/plan_steps>|$)/gi, " ")
  text = text.replace(/<(?:read_file|write_file|run_command|patch_file)[^>]*>[\s\S]*?(?:<\/(?:read_file|write_file|run_command|patch_file)>|$)/gi, " ")
  text = text.replace(/<[^>]+>/g, " ")

  const outside = proseOutsideAgentJson(text)
  if (outside) return outside

  if (!hasAgentShape(text) && !/^\s*[{[]/.test(text)) {
    return text.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim()
  }

  return recoverProse(text, extractStringArray(text, "plan_steps"), extractStringField(text, "thought"))
}

function sanitizeMessage(value: string): string {
  const text = String(value ?? "").trim()
  if (!text) return ""
  if (!hasAgentShape(text) && !/^\s*[{[]/.test(text)) {
    return text.replace(/```(?:json|JSON)?/g, "").replace(/```/g, "").trim()
  }
  const extracted = extractStringField(text, "message")
  if (extracted) return sanitizeMessage(extracted)
  return humanizeNonAgentText(text)
}

/**
 * Parses a model reply into structured fields. Works for valid JSON, fenced
 * JSON, truncated JSON, and plain prose mixed with JSON fragments.
 */
export function parseAgentReply(raw: string): ParsedAgentReply {
  const original = String(raw ?? "").trim()
  if (!original) return { ...EMPTY_REPLY }

  // Already-normalized chat text keeps its tags; extract them instead of JSON.
  if (!hasAgentShape(original) && (/<think>/i.test(original) || /<plan_steps/i.test(original))) {
    const thought = /<think>([\s\S]*?)(?:<\/think>|$)/i.exec(original)?.[1]?.trim() || ""
    const plan = extractPlanBlock(original)
    let message = original
      .replace(/<think>[\s\S]*?(?:<\/think>|$)/i, " ")
      .replace(/<plan_steps[\s\S]*?(?:<\/plan_steps>|$)/i, " ")
    message = message.replace(/<(?:read_file|write_file|run_command)[^>]*>[\s\S]*?(?:<\/(?:read_file|write_file|run_command)>|$)/gi, " ").trim()
    return {
      ...EMPTY_REPLY,
      thought: sanitizeMessage(thought),
      message: sanitizeMessage(message),
      planSteps: plan.steps,
      hadAgentShape: false,
    }
  }

  const source = hasAgentShape(original) ? focusLastAgentPayload(original) : original
  const fenced = stripOuterFence(source)
  const parsedObject = tryParseJson(fenced) ?? tryParseJson(source)
  let thought = ""
  let message = ""
  let action = ""
  let brandContext = ""
  let targetPath = ""
  let command = ""
  let fileContent = ""
  let planSteps: string[] = []
  let parsedJson = false

  if (parsedObject) {
    parsedJson = true
    thought = stringValue(parsedObject.thought)
    message = stringValue(parsedObject.message)
    action = stringValue(parsedObject.action)
    brandContext = stringValue(parsedObject.brand_context)
    targetPath = stringValue(parsedObject.target_path)
    command = stringValue(parsedObject.command)
    fileContent = stringValue(parsedObject.file_content)
    planSteps = stringArray(parsedObject.plan_steps)
  } else {
    thought = extractStringField(fenced, "thought")
    message = extractStringField(fenced, "message")
    action = extractStringField(fenced, "action")
    brandContext = extractStringField(fenced, "brand_context")
    targetPath = extractStringField(fenced, "target_path")
    command = extractStringField(fenced, "command")
    fileContent = extractStringField(fenced, "file_content")
    planSteps = extractStringArray(fenced, "plan_steps")
  }

  const hadAgentShape = hasAgentShape(original)
  const hasFields = Boolean(thought || message || action || brandContext || targetPath || command || fileContent || planSteps.length)
  const truncated = isTruncatedAgentJson(original)
  if (!hasFields) {
    const prose = humanizeNonAgentText(original)
    return {
      ...EMPTY_REPLY,
      message: sanitizeMessage(prose) || (truncated ? "" : "Completed the requested step."),
      hadAgentShape,
    }
  }

  const safeThought = sanitizeMessage(thought)
  let safeMessage = sanitizeMessage(message)
  if (!safeMessage) {
    const outside = proseOutsideAgentJson(original)
    if (outside && outside !== safeThought) safeMessage = outside
  }
  if (!safeMessage) {
    const recovered = recoverProse(fenced, planSteps, safeThought)
    if (recovered && recovered !== safeThought) safeMessage = recovered
  }
  // While a step is still streaming, do not present a synthesized completion.
  if (!safeMessage && !truncated) safeMessage = statusForAction(action, targetPath, command)
  if (!safeMessage && !truncated) safeMessage = safeThought || "Completed the requested step."

  return {
    thought: safeThought,
    message: safeMessage,
    action: action.trim(),
    brandContext: brandContext.trim(),
    planSteps: planSteps.map(sanitizeMessage).filter(Boolean),
    targetPath: targetPath.trim(),
    command: command.trim(),
    fileContent,
    parsedJson,
    hadAgentShape,
  }
}

/** Which plan step is currently in flight for a given action. */
export function planActiveIndex(action: string, stepCount: number): number {
  if (stepCount <= 0) return 0
  switch (action) {
    case "final_answer": return stepCount
    case "verify": return Math.max(0, stepCount - 1)
    case "read_file":
    case "search":
    case "view": return 0
    case "write_file":
    case "patch_file":
    case "run_terminal":
    case "edit":
    case "create":
    case "terminal": return Math.min(1, stepCount - 1)
    default: return 0
  }
}

function formatPlanBlock(reply: ParsedAgentReply, forceDone = false): string {
  if (!reply.planSteps.length) return ""
  const active = forceDone ? reply.planSteps.length : planActiveIndex(reply.action, reply.planSteps.length)
  const done = forceDone || reply.action === "final_answer" || active >= reply.planSteps.length
  return [
    `<plan_steps active="${active}" done="${done ? "true" : "false"}">`,
    ...reply.planSteps.map((step) => `- ${step}`),
    "</plan_steps>",
  ].join("\n")
}

/** Text used inside the agent loop; keeps tool tags for the tool executor. */
export function formatAgentReplyForLoop(reply: ParsedAgentReply): string {
  const thought = reply.thought ? `<think>${reply.thought}</think>` : ""
  const target = reply.targetPath
  if (reply.action === "read_file" && target) return `${thought}\n<read_file path="${target}" />\n${reply.message}`.trim()
  if (reply.action === "run_terminal" && reply.command) return `${thought}\n<run_command>${reply.command}</run_command>\n[COMMAND] ${reply.command}\n${reply.message}`.trim()
  if (reply.action === "write_file" && target) return `${thought}\n<write_file path="${target}">${reply.fileContent}</write_file>\n[NEW] ${target}\n${reply.message}`.trim()
  if (reply.action === "patch_file" && target) return `${thought}\n<write_file path="${target}">${reply.fileContent}</write_file>\n[MODIFY] ${target}\n${reply.message}`.trim()
  if (reply.action === "verify") return `${thought}\n${reply.message}\n[VERIFY] ${target || "workspace"}`.trim()
  return `${thought}\n${reply.message}`.trim()
}

/** Clean chat text: plan checklist + thought + message only. */
export function formatAgentReplyForChat(reply: ParsedAgentReply, options?: { done?: boolean }): string {
  const parts: string[] = []
  const plan = formatPlanBlock(reply, options?.done)
  if (plan) parts.push(plan)
  if (reply.brandContext && !reply.message.includes(reply.brandContext)) parts.push(`Workspace ${reply.brandContext}`)
  if (reply.thought && reply.thought !== reply.message) parts.push(`<think>${reply.thought}</think>`)
  // Per-file activity lines ([COMMAND], [VERIFY], Edit path) are intentionally
  // omitted here. File-path floods never belong in a chat bubble; detailed file
  // lists live strictly in the right-hand Changes tab. Step summaries are
  // provided by the caller via phaseSummaries in buildAssistantResponse.
  if (reply.message) parts.push(reply.message)
  return parts.join("\n").trim()
}

export function toAgentModelReply(raw: string): AgentModelReply {
  const parsed = parseAgentReply(raw)
  const structured = parsed.parsedJson || parsed.hadAgentShape
  return {
    loopText: structured ? formatAgentReplyForLoop(parsed) : String(raw ?? "").trim(),
    parsed,
  }
}

function extractPlanBlock(text: string): { withoutPlan: string; steps: string[]; activeIndex: number; done: boolean } {
  const match = /<plan_steps([^>]*)>([\s\S]*?)(?:<\/plan_steps>|$)/i.exec(text)
  if (!match) return { withoutPlan: text, steps: [], activeIndex: 0, done: false }
  const body = match[2] || ""
  const steps = body
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*]\s*/, "").trim())
    .filter(Boolean)
  const activeAttr = /active\s*=\s*["']?(\d+)/i.exec(match[1] || "")
  const done = /done\s*=\s*["']?true/i.test(match[1] || "")
  const activeIndex = activeAttr
    ? Math.max(0, Math.min(steps.length, Number(activeAttr[1])))
    : done ? steps.length : 0
  const withoutPlan = `${text.slice(0, match.index)}${text.slice(match.index + match[0].length)}`
  return { withoutPlan, steps, activeIndex, done }
}

function stripAgentJsonLeak(value: string): string {
  let text = String(value ?? "")
  text = text.replace(/```(?:json|JSON)?\s*([\s\S]*?)```/g, (block, body) => hasAgentShape(String(body)) ? "" : block)
  for (const key of AGENT_KEYS) {
    text = text.replace(new RegExp(`["']${escapeRegExp(key)}["']\\s*:\\s*"(?:\\\\.|[^"\\\\])*"`, "gi"), " ")
    text = text.replace(new RegExp(`["']${escapeRegExp(key)}["']\\s*:\\s*\\[[\\s\\S]*?\\]`, "gi"), " ")
  }
  text = text
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trim()
      if (!trimmed) return true
      if (/^[,{}[\]]+$/.test(trimmed)) return false
      if (new RegExp(`^["'](?:${AGENT_KEYS.join("|")})["']\\s*:`).test(trimmed)) return false
      return true
    })
    .join("\n")
  if (hasAgentShape(text)) text = humanizeNonAgentText(text)
  text = text
    .replace(/<read_file[^>]*\/?>/gi, "")
    .replace(/<write_file[\s\S]*?(?:<\/write_file>|$)/gi, "")
    .replace(/<run_command>[\s\S]*?(?:<\/run_command>|$)/gi, "")
  return text.replace(/\n{3,}/g, "\n\n").trim()
}

/**
 * Final render guard. Any message content — including old persisted messages
 * with raw JSON — is converted into plan metadata plus JSON-free chat text.
 */
export function sanitizeAgentChatContent(raw: string): SanitizedAgentContent {
  const source = String(raw ?? "")
  const durationSeconds = Number(/(?:^|\n)Thought for\s+(\d+)s\b/i.exec(source)?.[1] || 0) || undefined
  let formatted = source

  const hasTags = /<plan_steps|<think>/i.test(source)
  const looksLikeAgentJson = hasAgentShape(source) || /^\s*(?:```(?:json)?\s*)?\{\s*(?:["']|$)/i.test(source.trim())
  // Truncated JSON means the model is still streaming; the UI shows a live row.
  const incompleteJson = looksLikeAgentJson && isTruncatedAgentJson(source)
  if (looksLikeAgentJson) {
    formatted = formatAgentReplyForChat(parseAgentReply(source))
  } else if (!hasTags) {
    // Plain prose or an old JSON fragment that lost its keys.
    formatted = stripAgentJsonLeak(source)
  }

  const plan = extractPlanBlock(formatted)
  let content = stripAgentJsonLeak(plan.withoutPlan)
  content = content
    .replace(/^```(?:json|JSON)?\s*/i, "")
    .replace(/\s*```$/i, "")
    // Elapsed time is rendered by the checklist, not inside the response body.
    .replace(/^Thought for\s+\d+s\s*$/gim, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()

  const thought = /<think>([\s\S]*?)(?:<\/think>|$)/i.exec(content)?.[1]?.trim() || ""
  const openThink = /<think>/i.test(content) && !/<\/think>/i.test(content)

  return {
    content,
    thought,
    planSteps: plan.steps,
    activeIndex: plan.activeIndex,
    planDone: plan.done,
    durationSeconds,
    incomplete: incompleteJson || openThink,
  }
}
