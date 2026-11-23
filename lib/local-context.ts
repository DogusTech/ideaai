/**
 * Local Ollama context budgeting.
 *
 * Local models are loaded with a fixed context window (`num_ctx`). Every message
 * sent to Ollama must fit inside that window, otherwise the runtime answers with
 * a context-length / token-overflow error. These helpers keep packing
 * deterministic and conservative so a compact local model never overflows.
 *
 * This module is intentionally dependency-free so it can be imported by client
 * components, route handlers and server-only modules.
 */

export type LocalContextMessage = {
  role: string
  content: string
}

/** Safe default context window for every local Ollama request. */
export const LOCAL_OLLAMA_NUM_CTX = 8192
/** Wider window used on high-memory machines. */
export const LOCAL_OLLAMA_LARGE_NUM_CTX = 16384
/** Tokens reserved for the model's own response. */
export const LOCAL_OLLAMA_OUTPUT_RESERVE_TOKENS = 1280
/** Marker injected when older conversation turns are dropped. */
export const LOCAL_CONTEXT_TRUNCATION_MARKER = "… [earlier conversation truncated to fit the local model context window]"

/**
 * Conservative token estimate. Mixed prose, code and Turkish text can sit near
 * 2-3 characters per token; dividing by 2.5 deliberately overestimates so the
 * packed payload stays below the real context limit.
 */
export function estimateLocalTokens(value: string): number {
  const text = String(value ?? "")
  if (!text) return 0
  return Math.ceil(text.length / 2.5)
}

/** Truncates text to a token budget, keeping a visible truncation marker. */
export function truncateLocalText(
  value: string,
  maxTokens: number,
  marker = "\n… [context truncated to fit the local model]"
): string {
  const text = String(value ?? "")
  if (maxTokens <= 0) return ""
  if (estimateLocalTokens(text) <= maxTokens) return text
  const markerCost = marker.length + 1
  const maxChars = Math.max(0, Math.floor(maxTokens * 2.5) - markerCost)
  return `${text.slice(0, maxChars)}${marker}`
}

export type PackLocalConversationOptions = {
  /** Ollama `num_ctx` for this request. */
  contextWindow?: number
  /** Tokens reserved for the completion. */
  reserveTokens?: number
  /** Maximum share of the window the system prompt may consume (0.2 – 0.75). */
  systemBudgetRatio?: number
  /** Hard cap on retained conversational turns. */
  maxMessages?: number
}

/**
 * Packs a conversation into the context window:
 * - system prompts are merged and truncated to a bounded share of the window,
 * - the newest conversational turns are kept first,
 * - the latest turn is truncated instead of dropped when it alone is too large,
 * - a marker records when older history was removed.
 */
export function packLocalConversation(
  messages: LocalContextMessage[],
  options: PackLocalConversationOptions = {}
): LocalContextMessage[] {
  const contextWindow = Math.max(1024, Math.floor(options.contextWindow ?? LOCAL_OLLAMA_NUM_CTX))
  const reserveTokens = Math.max(0, Math.floor(options.reserveTokens ?? LOCAL_OLLAMA_OUTPUT_RESERVE_TOKENS))
  const budget = Math.max(768, contextWindow - reserveTokens)
  const contentBudget = Math.max(768, budget - estimateLocalTokens(LOCAL_CONTEXT_TRUNCATION_MARKER) - 8)
  const systemBudgetRatio = Math.min(0.75, Math.max(0.2, options.systemBudgetRatio ?? 0.6))
  const maxMessages = Math.max(2, Math.floor(options.maxMessages ?? 24))

  const normalized = (Array.isArray(messages) ? messages : [])
    .filter((message): message is LocalContextMessage => Boolean(message) && typeof message.content === "string")
    .map((message) => ({ role: String(message.role || "user"), content: message.content }))
  if (normalized.length === 0) return []

  const systemMessages = normalized.filter((message) => message.role === "system")
  const conversational = normalized.filter((message) => message.role !== "system")

  const systemBudget = Math.max(256, Math.floor(contentBudget * systemBudgetRatio))
  const systemContent = truncateLocalText(systemMessages.map((message) => message.content).join("\n\n"), systemBudget)
  const systemTokens = estimateLocalTokens(systemContent)

  let remaining = Math.max(256, contentBudget - systemTokens)
  const selected: LocalContextMessage[] = []
  const messageCap = Math.max(1, maxMessages - (systemContent ? 1 : 0))

  // Newest turns matter most for an agent loop; walk backwards until full.
  for (const message of [...conversational].reverse()) {
    if (selected.length >= messageCap) break
    if (remaining <= 24) break
    const tokens = estimateLocalTokens(message.content)
    if (tokens <= remaining) {
      selected.push(message)
      remaining -= tokens
      continue
    }
    const truncated = truncateLocalText(message.content, Math.max(64, remaining - 8))
    if (truncated) selected.push({ ...message, content: truncated })
    break
  }
  selected.reverse()

  const droppedHistory = selected.length < conversational.length
  const result: LocalContextMessage[] = []
  if (systemContent) {
    result.push({ role: "system", content: droppedHistory ? `${systemContent}\n\n${LOCAL_CONTEXT_TRUNCATION_MARKER}` : systemContent })
  } else if (droppedHistory) {
    result.push({ role: "system", content: LOCAL_CONTEXT_TRUNCATION_MARKER })
  }
  result.push(...selected)
  return result
}
