'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Cpu,
  Download,
  HardDrive,
  Info,
  LoaderCircle,
  Monitor,
  Play,
  RefreshCw,
  Sparkles,
  Trash2,
} from 'lucide-react'
import {
  localModelsBridge,
  type InstalledOllamaModel,
  type MachineSnapshot,
  type ModelStorage,
  type PullProgress,
} from '@/app/utils/local-models-bridge'

const GIB = 1024 ** 3

const MODEL_CATALOG = [
  {
    name: 'Qwen 2.5 Coder · 1.5B',
    model: 'qwen2.5-coder:1.5b',
    family: 'Qwen',
    size: '1.0 GB download',
    ram: 2,
    description: 'Ultra-lightweight coding model for low-memory machines and instant local replies.',
    tags: ['Coding', 'Ultra-lightweight', 'Recommended'],
  },
  {
    name: 'Qwen 2.5 Coder · 3B',
    model: 'qwen2.5-coder:3b',
    family: 'Qwen',
    size: '2.0 GB download',
    ram: 4,
    description: 'Fast coding assistant tuned for low-end and mid-tier laptops.',
    tags: ['Coding', 'Lightweight', 'Recommended'],
  },
  {
    name: 'Llama 3.2 · 3B',
    model: 'llama3.2:3b',
    family: 'Meta',
    size: '2.0 GB download',
    ram: 4,
    description: 'A fast general assistant for lightweight local tasks and lower-memory systems.',
    tags: ['General', 'Lightweight', 'Recommended'],
  },
  {
    name: 'Qwen 2.5 Coder · 7B',
    model: 'qwen2.5-coder:7b',
    family: 'Qwen',
    size: '4.7 GB download',
    ram: 8,
    description: 'A capable code model for repository questions, refactors, and everyday implementation work.',
    tags: ['Coding', 'Recommended'],
  },
  {
    name: 'Qwen 2.5 Coder · 14B',
    model: 'qwen2.5-coder:14b',
    family: 'Qwen',
    size: '9.0 GB download',
    ram: 16,
    description: 'A larger coding model for more involved repository and refactoring tasks.',
    tags: ['Coding', 'Advanced'],
  },
  {
    name: 'DeepSeek Coder V2 · 16B',
    model: 'deepseek-coder-v2:16b',
    family: 'DeepSeek',
    size: '8.9 GB download',
    ram: 16,
    description: 'A mixture-of-experts coding model suited to longer software engineering tasks.',
    tags: ['Coding', 'MoE'],
  },
  {
    name: 'CodeGemma · 7B',
    model: 'codegemma:7b',
    family: 'Google',
    size: '5.0 GB download',
    ram: 8,
    description: 'A compact code model for code completion, generation, and explanation.',
    tags: ['Coding', 'Compact'],
  },
] as const

function formatBytes(bytes?: number) {
  if (!bytes || !Number.isFinite(bytes) || bytes < 0) return '—'
  const units = ['B', 'KB', 'MB', 'GB']
  let value = bytes
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit++
  }
  return `${value.toFixed(unit === 0 ? 0 : 1)} ${units[unit]}`
}

function compatibleStatus(machine: MachineSnapshot | null, requiredRam: number) {
  if (!machine?.totalRamBytes) return { kind: 'unknown' as const, label: 'Check machine memory' }
  const totalRamGb = machine.totalRamBytes / GIB
  const dedicatedVramGb = (machine.gpuVramBytes || 0) / GIB
  // Ollama can offload only part of a model to the GPU; reserve 25% of VRAM as usable capacity.
  const effectiveCapacityGb = totalRamGb + dedicatedVramGb * 0.75
  const requiredWithHeadroomGb = requiredRam * 1.15
  if (effectiveCapacityGb < requiredWithHeadroomGb) return { kind: 'too-large' as const, label: 'Too large for this machine' }
  if (effectiveCapacityGb < requiredWithHeadroomGb * 1.2) return { kind: 'slow' as const, label: 'Will run slowly on this machine' }
  return { kind: 'ready' as const, label: 'Compatible with this machine' }
}

export function LocalModelsSettings({ onUseModel }: { onUseModel?: (modelName: string) => void }) {
  const [machine, setMachine] = useState<MachineSnapshot | null>(null)
  const [installedModels, setInstalledModels] = useState<InstalledOllamaModel[]>([])
  const [storage, setStorage] = useState<ModelStorage | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [desktopUnavailable, setDesktopUnavailable] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [progress, setProgress] = useState<Record<string, PullProgress>>({})
  const [detailsModel, setDetailsModel] = useState<string | null>(null)
  const [activeModel, setActiveModel] = useState('')
  const [busyModel, setBusyModel] = useState('')
  const [ollamaRunning, setOllamaRunning] = useState(false)
  const [lmStudioRunning, setLmStudioRunning] = useState(false)
  const [startingOllama, setStartingOllama] = useState(false)
  const [ollamaBinaryPath, setOllamaBinaryPath] = useState('')
  const [installingOllama, setInstallingOllama] = useState(false)
  const [installProgress, setInstallProgress] = useState(0)
  const [runtime, setRuntime] = useState<'Ollama' | 'LM Studio'>('Ollama')

  const refresh = useCallback(async (quiet = false) => {
    if (!localModelsBridge.available()) {
      setDesktopUnavailable(true)
      setLoading(false)
      setRefreshing(false)
      return
    }
    setDesktopUnavailable(false)
    setError('')
    if (quiet) setRefreshing(true)
    else setLoading(true)

    const [machineResult, listResult, runtimeResult] = await Promise.all([
      localModelsBridge.getMachine(),
      localModelsBridge.list(),
      localModelsBridge.getRuntimeStatus(),
    ])
    const binaryResult = await localModelsBridge.getOllamaBinary()
    if (binaryResult?.success) setOllamaBinaryPath(binaryResult.path || '')

    if (machineResult?.success) setMachine(machineResult.machine)
    else setError(machineResult?.error || 'Could not read hardware details.')

    if (listResult?.success) {
      setOllamaRunning(runtimeResult?.ollama ?? true)
      setInstalledModels(listResult.models || [])
      setStorage(listResult.storage || null)
    } else {
      setOllamaRunning(runtimeResult?.ollama ?? false)
      setError((current) => current ? `${current} ${listResult?.error || 'Ollama is unavailable.'}` : (listResult?.error || 'Ollama is unavailable.'))
    }

    setLoading(false)
    setRefreshing(false)
    setLmStudioRunning(Boolean(runtimeResult?.lmStudio))
  }, [])

  useEffect(() => {
    void refresh()
    const removePullListener = localModelsBridge.onPullProgress((event) => {
      setProgress((current) => ({ ...current, [event.modelName]: event }))
      if (event.status === 'error') setError(event.message || `Could not download ${event.modelName}.`)
      if (event.status === 'complete') setNotice(`${event.modelName} is ready to use.`)
    })
    const removeInstallListener = localModelsBridge.onInstallProgress((event) => setInstallProgress(Number(event.percent || 0)))
    return () => { removePullListener(); removeInstallListener() }
  }, [refresh])

  const startOllama = async () => {
    setStartingOllama(true)
    const result = await localModelsBridge.ensureOllamaReady()
    setStartingOllama(false)
    if (result?.success) { setNotice('Ollama is ready.'); await refresh(true) }
    else setError(result?.error || 'Could not start Ollama.')
  }

  const browseOllama = async () => {
    const result = await localModelsBridge.browseOllamaBinary()
    if (result?.success) { setOllamaBinaryPath(result.path || ''); setNotice('Ollama executable saved.'); await refresh(true) }
    else if (!result?.canceled) setError(result?.error || 'Could not select the Ollama executable.')
  }

  const installOllama = async () => {
    setInstallingOllama(true); setInstallProgress(0)
    const result = await localModelsBridge.installOllama()
    setInstallingOllama(false)
    if (result?.success) { setOllamaBinaryPath(result.path || ''); setNotice('Ollama is installed and ready.'); await refresh(true) }
    else setError(result?.error || 'Could not install Ollama.')
  }

  const installedNames = useMemo(() => new Set(installedModels.map((item) => item.name)), [installedModels])

  async function downloadModel(modelName: string) {
    setError('')
    setNotice('')
    setBusyModel(modelName)
    setProgress((current) => ({ ...current, [modelName]: { modelName, percent: 0, status: 'starting' } }))
    const result = await localModelsBridge.pull(modelName)
    setBusyModel('')
    if (!result?.success) {
      setError(result?.error || `Ollama could not download ${modelName}.`)
      setProgress((current) => ({ ...current, [modelName]: { modelName, percent: 0, status: 'error', message: result?.error } }))
      return
    }
    setProgress((current) => ({ ...current, [modelName]: { modelName, percent: 100, status: 'complete' } }))
    setNotice(`${modelName} was downloaded successfully.`)
    await refresh(true)
  }

  async function loadModel(modelName: string): Promise<boolean> {
    setError('')
    setNotice('')
    setBusyModel(modelName)
    const result = await localModelsBridge.load(modelName)
    setBusyModel('')
    if (!result?.success) {
      setError(result?.error || `Could not load ${modelName}.`)
      return false
    }
    setActiveModel(modelName)
    setNotice(`${modelName} is loaded as the active local model.`)
    return true
  }

  async function deleteModel(modelName: string) {
    if (!window.confirm(`Delete ${modelName} from this computer? You can download it again later.`)) return
    setError('')
    setNotice('')
    setBusyModel(modelName)
    const result = await localModelsBridge.remove(modelName)
    setBusyModel('')
    if (!result?.success) {
      setError(result?.error || `Could not delete ${modelName}.`)
      return
    }
    if (activeModel === modelName) setActiveModel('')
    setNotice(`${modelName} was removed.`)
    await refresh(true)
  }

  const storageTotal = storage?.totalBytes || 0
  const modelWidth = storageTotal ? Math.min(100, (storage!.modelBytes / storageTotal) * 100) : 0
  const otherWidth = storageTotal ? Math.min(100 - modelWidth, (storage!.otherBytes / storageTotal) * 100) : 0
  const freeWidth = storageTotal ? Math.max(0, 100 - modelWidth - otherWidth) : 0

  if (loading) {
    return <div data-research-lab className="flex min-h-72 items-center justify-center text-sm text-neutral-500 dark:text-neutral-400"><LoaderCircle className="mr-2 h-4 w-4 animate-spin" />Reading this machine…</div>
  }

  return (
    <div data-research-lab className="mx-auto w-full max-w-4xl space-y-8 pb-5 text-obsidian dark:text-neutral-100">
      <header className="flex flex-wrap items-start justify-between gap-4 pr-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-graphite"><Sparkles className="h-3.5 w-3.5" /> On-device inference</div>
          <h2 className="text-2xl font-semibold tracking-tight">Local Models</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500 dark:text-neutral-400">Choose a model for private, local coding work. Downloads run through Ollama on this computer.</p>
        </div>
        <button type="button" onClick={() => void refresh(true)} disabled={refreshing} className="inline-flex items-center gap-2 rounded-full border border-black/[0.045] dark:border-[#3a3a3a] bg-transparent px-4 py-2 text-xs font-medium text-graphite transition hover:bg-ash disabled:opacity-60">
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </header>

      {desktopUnavailable && <div className="rounded-2xl border border-black/[0.045] dark:border-[#3a3a3a] bg-ash p-4 text-sm text-graphite">Local model management is available in the Turaen desktop app.</div>}
      {error && <div role="alert" className="flex items-start gap-3 rounded-2xl border border-black/[0.045] dark:border-[#3a3a3a] bg-ash px-4 py-3 text-sm text-graphite"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /><span className="min-w-0 flex-1">{error}</span>{/ECONNREFUSED|timed out|Could not connect|did not become ready/i.test(error) && <button type="button" onClick={() => void startOllama()} disabled={startingOllama} className="shrink-0 rounded-full border border-transparent bg-[#0A0A0A] px-3 py-1.5 text-xs font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50 dark:bg-[#FAFAFA] dark:text-[#0A0A0A] dark:hover:bg-[#E4E4E7]">{startingOllama ? 'Starting…' : 'Start Ollama'}</button>}{/not found|not installed|executable/i.test(error) && <><button type="button" onClick={() => void browseOllama()} className="shrink-0 rounded-full border border-black/[0.12] px-3 py-1.5 text-xs font-medium">Browse…</button><button type="button" onClick={() => void installOllama()} disabled={installingOllama} className="shrink-0 rounded-full border border-transparent bg-[#0A0A0A] px-3 py-1.5 text-xs font-medium text-[#FAFAFA] hover:bg-[#27272A] disabled:opacity-50 dark:bg-[#FAFAFA] dark:text-[#0A0A0A] dark:hover:bg-[#E4E4E7]">{installingOllama ? `Installing ${installProgress}%` : 'Install Ollama'}</button></>}{!/ECONNREFUSED|timed out|Could not connect|did not become ready|not found|not installed|executable/i.test(error) && <button type="button" onClick={() => void refresh(true)} className="shrink-0 rounded-full border border-black/[0.12] px-3 py-1.5 text-xs font-medium">Retry</button>}</div>}
      {ollamaBinaryPath && <p className="text-xs text-graphite">Ollama executable: <span className="font-mono">{ollamaBinaryPath}</span> <button type="button" onClick={() => void browseOllama()} className="ml-2 underline underline-offset-2">Browse…</button></p>}
      {notice && <div role="status" className="flex items-start gap-2 rounded-2xl border border-black/[0.045] dark:border-[#3a3a3a] bg-ash px-4 py-3 text-sm text-graphite"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />{notice}</div>}

<section aria-labelledby="machine-heading" className="ideaai-panel overflow-hidden rounded-2xl border">
<div className="ideaai-machine-header flex items-center gap-2 border-b px-5 py-3.5"><Monitor className="h-4 w-4 text-neutral-500 dark:text-[#9ca3af]" /><h3 id="machine-heading" className="text-[11px] font-semibold tracking-[0.15em] text-neutral-500 dark:text-[#9ca3af]">YOUR MACHINE</h3></div>
<div className="ideaai-machine-body grid gap-px sm:grid-cols-3">
          <div className="ideaai-machine-cell p-5"><div className="mb-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-[#9ca3af]"><Cpu className="h-4 w-4" /> Available memory</div><div className="text-xl font-semibold text-neutral-900 dark:text-[#e5e5e5]">{machine ? formatBytes(machine.freeRamBytes) : '—'}</div><div className="mt-1 text-xs text-neutral-500 dark:text-[#9ca3af]">of {formatBytes(machine?.totalRamBytes)} total RAM</div><div className="mt-1 text-[11px] font-medium text-neutral-500 dark:text-[#9ca3af]">Hardware tier: {machine?.tierLabel || 'Detecting…'}</div></div>
<div className="ideaai-machine-cell p-5"><div className="mb-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-[#9ca3af]"><Monitor className="h-4 w-4" /> Graphics processor</div><div className="truncate text-sm font-semibold text-neutral-900 dark:text-[#e5e5e5]" title={machine?.gpuName}>{machine?.gpuName || 'Not detected'}</div><div className="mt-1 text-xs capitalize text-neutral-500 dark:text-[#9ca3af]">{machine?.gpuVramBytes ? `${formatBytes(machine.gpuVramBytes)} detected VRAM` : 'VRAM not reported by driver'}</div><div className="mt-1 text-[11px] text-neutral-500 dark:text-[#9ca3af]">Models can also use system RAM when VRAM is limited.</div></div>
<div className="ideaai-machine-cell p-5"><div className="mb-2 flex items-center gap-2 text-xs text-neutral-500 dark:text-[#9ca3af]"><HardDrive className="h-4 w-4" /> Ollama model directory</div><div className="truncate text-sm font-semibold text-neutral-900 dark:text-[#e5e5e5]" title={machine?.modelDirectory}>{machine?.modelDirectory || 'Default Ollama location'}</div><div className="mt-1 text-xs text-neutral-500 dark:text-[#9ca3af]">Local storage · not synced</div></div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold">Run models with</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {(['Ollama', 'LM Studio'] as const).map((name) => {
            const running = name === 'Ollama' ? ollamaRunning : lmStudioRunning
            return <button key={name} type="button" onClick={() => setRuntime(name)} className={`flex items-center justify-between rounded-2xl border p-4 text-left transition-colors ${runtime === name ? 'border-black/[0.12]' : 'border-black/[0.045] dark:border-[#3a3a3a] hover:bg-ash'}`}><span><span className="block text-sm font-semibold">{name}</span><span className="mt-1 block text-xs text-graphite">{name === 'Ollama' ? 'Local open-source model runtime' : 'OpenAI-compatible local server'}</span></span><span className="text-xs text-graphite">{running ? 'Running' : 'Not running'}</span></button>
          })}
        </div>
        {runtime === 'LM Studio' && <p className="text-xs text-graphite">Start the LM Studio local server to connect it to the chat composer. Ollama model downloads remain available below.</p>}
      </section>

      <section aria-labelledby="recommended-heading" className="space-y-8">
        <div className="flex items-end justify-between gap-3"><div><h3 id="recommended-heading" className="text-base font-semibold">Recommended for coding</h3><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Compatibility estimates total RAM plus partial dedicated GPU offloading.</p></div><span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[10px] font-medium text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">Ollama catalog</span></div>
        <div className="space-y-4">
          {MODEL_CATALOG.map((model) => {
            const compatibility = compatibleStatus(machine, model.ram)
            const isInstalled = installedNames.has(model.model)
            const currentProgress = progress[model.model]
            const isPulling = busyModel === model.model || currentProgress?.status === 'pulling' || currentProgress?.status === 'starting'
            const tooLarge = compatibility.kind === 'too-large'
            return (
<article key={model.model} className={`ideaai-model-card rounded-xl border p-5 transition-colors ${activeModel === model.model ? 'ring-1 ring-[#606060]' : ''}`}>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 items-start gap-3">
                    <label className="mt-1 inline-flex shrink-0 cursor-pointer items-center" title={`Select ${model.name}`}>
                      <input type="radio" name="local-model" checked={activeModel === model.model} onChange={() => void loadModel(model.model)} disabled={!isInstalled || busyModel !== ''} className="h-4 w-4 accent-black" />
                    </label>
                    <div className="min-w-0 flex-1">
<div className="flex flex-wrap items-center gap-2"><h4 className="ideaai-model-title font-semibold">{model.name}</h4>{model.tags.map((tag) => <span key={tag} className="ideaai-model-badge rounded-full px-2 py-0.5 text-[10px] font-medium">{tag}</span>)}</div>
<p className="ideaai-model-meta mt-1.5 max-w-2xl text-xs leading-5">{model.description}</p>
<div className="ideaai-model-meta mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px]"><span>{model.size}</span><span>Needs about {model.ram} GB RAM</span><span>{model.family}</span></div>
                      {compatibility.kind === 'too-large' && <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-graphite"><AlertTriangle className="h-3.5 w-3.5" /> Too large for this machine</p>}
                      {compatibility.kind === 'slow' && <p className="mt-3 flex items-center gap-1.5 text-xs font-medium text-graphite"><AlertTriangle className="h-3.5 w-3.5" /> Will run slowly on this machine</p>}
                      {compatibility.kind === 'ready' && <p className="mt-3 flex items-center gap-1.5 text-xs text-graphite"><Check className="h-3.5 w-3.5" /> Compatible with this machine</p>}
                      {compatibility.kind === 'unknown' && <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">{compatibility.label}</p>}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                      <button type="button" onClick={() => setDetailsModel(detailsModel === model.model ? null : model.model)} aria-expanded={detailsModel === model.model} className="rounded-full border border-black/[0.045] dark:border-[#3a3a3a] px-4 py-2 text-xs font-medium text-graphite transition hover:bg-ash">Details</button>
                    {isInstalled ? (
                      <><button type="button" onClick={async () => { if (await loadModel(model.model)) onUseModel?.(model.model) }} disabled={busyModel !== ''} className="inline-flex items-center gap-1.5 rounded-full bg-obsidian px-4 py-2 text-xs font-medium text-paper transition hover:bg-graphite disabled:opacity-50">Use with Turaen</button><button type="button" onClick={() => void loadModel(model.model)} disabled={busyModel !== ''} className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.045] dark:border-[#3a3a3a] px-4 py-2 text-xs font-medium text-graphite transition hover:bg-ash disabled:opacity-50"><Play className="h-3.5 w-3.5" />{activeModel === model.model ? 'Loaded' : 'Load'}</button><button type="button" onClick={() => void deleteModel(model.model)} disabled={busyModel !== ''} aria-label={`Delete ${model.name}`} className="grid h-9 w-9 place-items-center rounded-full text-graphite hover:bg-ash disabled:opacity-50"><Trash2 className="h-4 w-4" /></button></>
                    ) : (
                      <button type="button" onClick={() => void downloadModel(model.model)} disabled={isPulling || desktopUnavailable} className="inline-flex min-w-28 items-center justify-center gap-1.5 rounded-full border border-black/[0.045] dark:border-[#3a3a3a] px-4 py-2 text-xs font-semibold text-obsidian transition hover:bg-ash disabled:cursor-not-allowed disabled:opacity-50">
                        {isPulling ? <><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Downloading… {Math.round(currentProgress?.percent || 0)}%</> : currentProgress?.status === 'complete' ? <><Check className="h-3.5 w-3.5" /> Downloaded</> : <><Download className="h-3.5 w-3.5" /> Download</>}
                      </button>
                    )}
                  </div>
                </div>
                {isPulling && <div className="mt-4"><div className="mb-1.5 flex justify-between text-[11px] text-graphite"><span>Downloading… {Math.round(currentProgress?.percent || 0)}%</span><span className="max-w-[55%] truncate">{currentProgress?.message || 'Preparing model files'}</span></div><div role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={currentProgress?.percent || 0} className="h-1.5 overflow-hidden rounded-full bg-ash"><div className="h-full rounded-full bg-obsidian transition-[width] duration-300" style={{ width: `${Math.max(2, currentProgress?.percent || 0)}%` }} /></div></div>}
                {detailsModel === model.model && <div className="mt-4 rounded-2xl bg-neutral-50 p-3 text-xs leading-5 text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300"><p>Model tag: <code className="rounded-2xl bg-white px-1.5 py-0.5 font-mono dark:bg-neutral-900">{model.model}</code></p><p className="mt-1">Estimated memory is a baseline. Context length, concurrent apps, quantization, and GPU memory can change actual performance.</p></div>}
              </article>
            )
          })}
        </div>
      </section>

      <section aria-labelledby="downloaded-heading" className="space-y-8">
        <div><h3 id="downloaded-heading" className="text-base font-semibold">Downloaded models</h3><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Models already installed in your local Ollama library.</p></div>
<div className="ideaai-storage-card overflow-hidden rounded-xl border">
<div className="flex items-center justify-between border-b border-[#303030] px-4 py-3"><span className="text-xs font-medium text-[#f5f5f5]">Library storage</span><span className="text-[11px] text-[#9ca3af]">{formatBytes(storage?.totalBytes)} total</span></div>
          <div className="px-4 py-4">
            <div aria-label="Storage usage" className="flex h-2 overflow-hidden rounded-full bg-ash"><div className="bg-obsidian" style={{ width: `${modelWidth}%` }} /><div className="bg-graphite" style={{ width: `${otherWidth}%` }} /><div className="bg-smoke" style={{ width: `${freeWidth}%` }} /></div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-[11px]"><div><span className="mb-1 block text-neutral-500 dark:text-neutral-400">Models size</span><strong className="font-semibold">{formatBytes(storage?.modelBytes)}</strong></div><div><span className="mb-1 block text-neutral-500 dark:text-neutral-400">Other files</span><strong className="font-semibold">{formatBytes(storage?.otherBytes)}</strong></div><div><span className="mb-1 block text-neutral-500 dark:text-neutral-400">Free space</span><strong className="font-semibold">{formatBytes(storage?.freeBytes)}</strong></div></div>
          </div>
          {installedModels.length ? (
<div className="divide-y divide-[#303030]">
              {installedModels.map((model) => (
                <div key={model.name} className="px-4 py-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2"><span className="truncate text-sm font-medium">{model.name}</span>{activeModel === model.name && <span className="rounded-full bg-ash px-2 py-0.5 text-[10px] font-medium text-graphite">Active</span>}</div>
                      <div className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">{formatBytes(model.sizeBytes)}{model.modifiedAt ? ` · ${model.modifiedAt}` : ''}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={async () => { if (await loadModel(model.name)) onUseModel?.(model.name) }} disabled={busyModel !== ''} className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.045] dark:border-[#3a3a3a] px-3 py-2 text-xs font-medium hover:bg-ash disabled:opacity-50">Use with Turaen</button>
                      <button type="button" onClick={() => void loadModel(model.name)} disabled={busyModel !== ''} className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.045] dark:border-[#3a3a3a] px-3 py-2 text-xs font-medium hover:bg-ash disabled:opacity-50"><Play className="h-3.5 w-3.5" /> Load</button>
                      <button type="button" onClick={() => setDetailsModel(detailsModel === model.name ? null : model.name)} aria-expanded={detailsModel === model.name} aria-label={`Details for ${model.name}`} className="rounded-full border border-black/[0.045] dark:border-[#3a3a3a] px-3 py-2 text-xs font-medium hover:bg-ash"><Info className="h-3.5 w-3.5" /></button>
                      <button type="button" onClick={() => void deleteModel(model.name)} disabled={busyModel !== ''} aria-label={`Delete ${model.name}`} className="rounded-full border border-black/[0.045] dark:border-[#3a3a3a] px-3 py-2 text-xs font-medium text-graphite disabled:opacity-50"><Trash2 className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>
                  {detailsModel === model.name && <div className="mt-3 rounded-2xl bg-neutral-50 px-3 py-2.5 text-xs leading-5 text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300"><p>Model ID: <code className="font-mono">{model.id}</code></p><p>Stored under: <code className="break-all font-mono">{storage?.path || machine?.modelDirectory || 'Default Ollama location'}</code></p></div>}
                </div>
              ))}
            </div>
          ) : <div className="px-4 py-8 text-center"><div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"><HardDrive className="h-4 w-4" /></div><p className="text-sm font-medium">No models installed yet</p><p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">Choose a recommended model above to get started.</p></div>}
        </div>
      </section>
    </div>
  )
}

