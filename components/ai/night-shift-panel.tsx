'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Moon,
  Shield,
  ShieldAlert,
  Cpu,
  HardDrive,
  Download,
  Trash2,
  Play,
  Pause,
  Square,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  FolderOpen,
  GitBranch,
  Terminal,
  ChevronDown,
  ChevronUp,
  FileCode,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  Eye,
  Check,
} from 'lucide-react'
import { TuraenLogo } from '@/components/brand/turaen-logo'
import {
  localModelsBridge,
  type HardwareProfile,
  type CuratedModelItem,
  type ModelPullProgressEvent,
  type DeviceTier,
} from '@/app/utils/local-models-bridge'
import { AgentBridge } from '@/app/utils/agent-bridge'
import { canQueueNightShift, canUseNightShiftSchedule, canUseRemoteWorker, requiresProForModel, type PlanState } from '@/lib/plan-entitlements'

export interface NightShiftTaskItem {
  id: string
  title: string
  verificationCommand: string
  status: 'queued' | 'running' | 'completed' | 'failed'
}

interface NightShiftPanelProps {
  isOpen: boolean
  onClose: () => void
  currentWorkspaceRoot?: string | null
  onSelectWorkspace?: () => void
  onOpenModelHub?: () => void
  plan?: PlanState
  onUpgrade?: (reason: string) => void
}

export function NightShiftPanel({
  isOpen,
  onClose,
  currentWorkspaceRoot,
  onSelectWorkspace,
  onOpenModelHub,
  plan = { tier: 'free', devPreview: false },
  onUpgrade,
}: NightShiftPanelProps) {
  // --- Hardware & Catalog States ---
  const [profile, setProfile] = useState<HardwareProfile | null>(null)
  const [catalog, setCatalog] = useState<CuratedModelItem[]>([])
  const [activeTab, setActiveTab] = useState<'queue' | 'hub' | 'audit'>('queue')
  const [activePull, setActivePull] = useState<{ [tag: string]: ModelPullProgressEvent }>({})
  const [activeOllamaModel, setActiveOllamaModel] = useState<string>('qwen2.5-coder:7b')
  const [loadingProfile, setLoadingProfile] = useState(false)

  // --- Strict Local Privacy Shield States ---
  const [strictLocalMode, setStrictLocalMode] = useState(false)
  const [blockedAuditCount, setBlockedAuditCount] = useState(0)
  const [recentBlockedLogs, setRecentBlockedLogs] = useState<any[]>([])

  // --- Schedule / Trigger States (Reference 7) ---
  const [scheduleFrequency, setScheduleFrequency] = useState('Every day')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [gmtOffset, setGmtOffset] = useState('')

  // Dynamically calculate local timezone / GMT offset
  useEffect(() => {
    try {
      const offsetMinutes = new Date().getTimezoneOffset()
      const hours = Math.abs(Math.floor(offsetMinutes / 60))
      const sign = offsetMinutes <= 0 ? '+' : '-'
      const zoneName = Intl.DateTimeFormat().resolvedOptions().timeZone
      setGmtOffset(`GMT${sign}${hours} (${zoneName})`)
    } catch {
      setGmtOffset('GMT+3')
    }
  }, [])

  // --- Night Shift Task Queue States ---
  const [taskQueue, setTaskQueue] = useState<NightShiftTaskItem[]>([
    {
      id: 'task-init-1',
      title: 'Run full type-check and generate unit tests for untested modules',
      verificationCommand: 'npx tsc --noEmit',
      status: 'queued',
    },
  ])
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskVerification, setNewTaskVerification] = useState('npm test')
  const [activeRunId, setActiveRunId] = useState<string | null>(null)
  const [runStatus, setRunStatus] = useState<string>('idle')
  const [liveLogs, setLiveLogs] = useState<Array<{ timestamp: string; level: string; message: string }>>([])
  const [isolatedBranchName, setIsolatedBranchName] = useState<string>('')
  const [morningSummaryModal, setMorningSummaryModal] = useState<any | null>(null)
  const [remoteWorkerOpen, setRemoteWorkerOpen] = useState(false)
  const [remoteWorkerEnabled, setRemoteWorkerEnabled] = useState(false)
  const [remoteWorkerEndpoint, setRemoteWorkerEndpoint] = useState('')
  const [remoteWorkerToken, setRemoteWorkerToken] = useState('')
  const [testStatus, setTestStatus] = useState('')

  // --- Load Initial Hardware & Privacy Data ---
  const refreshData = useCallback(async () => {
    setLoadingProfile(true)
    try {
      const profRes = await localModelsBridge.getHardwareProfile()
      if (profRes.success && profRes.profile) {
        setProfile(profRes.profile)
      }

      const catRes = await localModelsBridge.getHubCatalog()
      if (catRes.success && catRes.catalog) {
        setCatalog(catRes.catalog)
        const installedRec = catRes.catalog.find((c) => c.installed && c.recommended)
        if (installedRec) {
          setActiveOllamaModel(installedRec.modelTag)
        } else {
          const anyInstalled = catRes.catalog.find((c) => c.installed)
          if (anyInstalled) setActiveOllamaModel(anyInstalled.modelTag)
        }
      }

      const privRes = await AgentBridge.getPrivacyStatus()
      if (privRes.success && privRes.status) {
        setStrictLocalMode(privRes.status.strictLocalMode)
        setBlockedAuditCount(privRes.status.blockedCount)
        setRecentBlockedLogs(privRes.status.recentBlocked || [])
      }
      const daemonRes = await AgentBridge.getNightShiftStatus()
      if (daemonRes.success && daemonRes.state) {
        setRemoteWorkerEnabled(Boolean(daemonRes.state.remoteWorker?.enabled))
        setRemoteWorkerEndpoint(daemonRes.state.remoteWorker?.endpoint || '')
        setLiveLogs(daemonRes.state.logs || [])
        if (daemonRes.state.remoteResults) {
          setLiveLogs((current) => [...current, { timestamp: new Date().toLocaleTimeString(), level: 'info', message: `Remote worker results synchronized: ${JSON.stringify(daemonRes.state.remoteResults).slice(0, 220)}` }])
        }
        const active = daemonRes.active
        if (active) { setActiveRunId(active.id); setRunStatus(active.status) }
      }
    } catch (err) {
      console.error('Failed to load Night Shift data:', err)
    } finally {
      setLoadingProfile(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      void refreshData()
    }
  }, [isOpen, refreshData])

  useEffect(() => {
    if (!isOpen) return
    return AgentBridge.onNightShiftLog((log) => setLiveLogs((current) => [...current, log].slice(-300)))
  }, [isOpen])

  useEffect(() => {
    const unsub = localModelsBridge.onHubPullProgress((event) => {
      setActivePull((prev) => ({
        ...prev,
        [event.modelTag]: event,
      }))
      if (event.status === 'complete') {
        void refreshData()
      }
    })
    return () => unsub()
  }, [refreshData])

  const handleTogglePrivacy = async () => {
    const nextVal = !strictLocalMode
    const res = await AgentBridge.toggleStrictPrivacy(nextVal)
    if (res.success) {
      setStrictLocalMode(nextVal)
    }
  }

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim()) return
    if (!canQueueNightShift(taskQueue.length + 1, plan)) { onUpgrade?.('Free plans can queue one manual Night Shift task.'); return }

    const newTask: NightShiftTaskItem = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      verificationCommand: newTaskVerification.trim() || 'npm test',
      status: 'queued',
    }

    setTaskQueue((prev) => [...prev, newTask])
    setNewTaskTitle('')
    setNewTaskVerification('npm test')
  }

  const handleRemoveTask = (id: string) => {
    setTaskQueue((prev) => prev.filter((t) => t.id !== id))
  }

  const handleStartNightShift = async () => {
    const workspace = currentWorkspaceRoot || process.cwd()
    if (!taskQueue.length) return
    if (!canQueueNightShift(taskQueue.length, plan)) { onUpgrade?.('Queue additional Night Shift tasks with Turaen Pro.'); return }
    if (requiresProForModel('Local (Ollama)', activeOllamaModel, plan)) { onUpgrade?.('Night Shift models above 3B are included with Turaen Pro.'); return }
    if (!canUseNightShiftSchedule(plan)) { onUpgrade?.('OS WakeToRun scheduling is a Pro feature.'); return }
    if (remoteWorkerEnabled && !canUseRemoteWorker(plan)) { onUpgrade?.('Remote Worker is available on Turaen Pro.'); return }

    setRunStatus('initializing')
    setLiveLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        level: 'info',
        message: `Initializing Safe Autonomous Sandbox for workspace: ${workspace}`,
      },
    ])

    try {
      setRunStatus('running')
      const runnerRes = await AgentBridge.syncNightShift({
        tasks: taskQueue.map((task) => ({ ...task, workspaceRoot: workspace, ollamaModel: activeOllamaModel })),
        schedule: { enabled: true, time: scheduleTime, frequency: scheduleFrequency, wake: true },
        remoteWorker: { enabled: remoteWorkerEnabled, endpoint: remoteWorkerEndpoint, token: remoteWorkerToken },
      })
      if (!runnerRes.success) throw new Error(runnerRes.error || 'Could not persist Night Shift queue.')
      const scheduleRes = await AgentBridge.scheduleNightShift({ enabled: true, time: scheduleTime, frequency: scheduleFrequency, wake: true })
      if (!scheduleRes.success) throw new Error(scheduleRes.error || 'Could not register the OS wake schedule.')
      const startRes = await AgentBridge.startNightShift({ workspaceRoot: workspace, ollamaModel: activeOllamaModel, tasks: taskQueue })

      if (startRes.success) {
        setActiveRunId(startRes.pid ? `daemon-${startRes.pid}` : 'nightshift-daemon')
        setLiveLogs((prev) => [
          ...prev,
          {
            timestamp: new Date().toLocaleTimeString(),
            level: 'info',
            message: `Night Shift daemon active (${activeOllamaModel}).`,
          },
        ])
      }
    } catch (err: any) {
      setRunStatus('failed')
      setLiveLogs((prev) => [
        ...prev,
        { timestamp: new Date().toLocaleTimeString(), level: 'error', message: err.message },
      ])
    }
  }

  const handleTestNightShift = async () => {
    const workspace = currentWorkspaceRoot || process.cwd()
    setTestStatus('Starting health check…')
    const result = await AgentBridge.testNightShift({ workspaceRoot: workspace, ollamaModel: activeOllamaModel })
    setTestStatus(result.success ? 'Health check running in the Execution Stream.' : result.error || 'Health check could not start.')
  }

  const handleAbortRun = async () => {
    if (!activeRunId) return
    await AgentBridge.abortOvernightRun(activeRunId)
    setRunStatus('aborted')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 backdrop-blur-sm sm:p-6">
      <div
        role="dialog"
        aria-modal="true"
            className="ideaai-panel flex h-[min(880px,94vh)] w-full max-w-6xl flex-col overflow-hidden rounded-[24px] border shadow-[0px_4px_32px_rgba(0,0,0,0.5)]"
      >
        {/* --- Top Header (References 6 & 7) --- */}
        <div className="flex items-center justify-between border-b border-[#e0e0e0] dark:border-[#222222] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-[#f1f1f1] dark:bg-[#1f1f1f] text-[#0A0A0A] dark:text-[#FAFAFA]">
              <TuraenLogo className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="headline-md tracking-tight font-medium">Night Shift</h2>
                <button
                  type="button"
                  onClick={handleTogglePrivacy}
                  title="Toggle Local Privacy Shield"
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium border transition-colors ${
                    strictLocalMode
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'border-[#e0e0e0] dark:border-[#333333] bg-[#f1f1f1] dark:bg-[#1f1f1f] text-[#666666] dark:text-[#999999]'
                  }`}
                >
                  {strictLocalMode ? (
                    <>
                      <Shield className="h-3 w-3 text-emerald-500" />
                      <span>Privacy Guard: Strict Local</span>
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="h-3 w-3 text-amber-500" />
                      <span>Privacy Guard: Normal</span>
                    </>
                  )}
                </button>
              </div>
              <p className="body-md text-xs text-[#666666] dark:text-[#999999] mt-0.5">
                Safe overnight self-healing execution on local models with zero egress.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full text-[#666666] hover:bg-[#f1f1f1] dark:text-[#999999] dark:hover:bg-[#1f1f1f] transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* --- Sub-Tabs Bar --- */}
        <div className="flex items-center gap-3 border-b border-[var(--workspace-border)] bg-[var(--workspace-panel-muted)] px-6 py-2.5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('queue')}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
              activeTab === 'queue'
                ? 'bg-[#303030] text-[#f5f5f5] ring-1 ring-[#404040]'
                : 'text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Night Shift Queue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hub')}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-medium transition-colors ${
              activeTab === 'hub'
                ? 'bg-[#303030] text-[#f5f5f5] ring-1 ring-[#404040]'
                : 'text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            <span>Model Hub</span>
            {profile && (
              <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.2 text-[9px] uppercase font-semibold">
                {profile.tier}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('audit')}
            className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
              activeTab === 'audit'
                ? 'bg-[#303030] text-[#f5f5f5] ring-1 ring-[#404040]'
                : 'text-[#666666] dark:text-[#999999] hover:bg-black/5 dark:hover:bg-white/5'
            }`}
          >
            Privacy Audit Log ({blockedAuditCount})
          </button>

          {/* Target Workspace Selector */}
          <div className="ml-auto flex items-center gap-3 text-[#9ca3af]">
            <span className="text-[11px]">Workspace:</span>
            <button
              type="button"
              onClick={onSelectWorkspace}
              className="ideaai-control flex h-[38px] items-center gap-1.5 rounded-full border px-4 py-1 text-[11px]"
              title={currentWorkspaceRoot || 'Select workspace folder'}
            >
              <FolderOpen className="h-3 w-3" />
              <span className="max-w-[200px] truncate">
                {currentWorkspaceRoot ? currentWorkspaceRoot.split(/[\\/]/).pop() : 'Current Workspace'}
              </span>
            </button>
            <button
              type="button"
              onClick={handleStartNightShift}
              disabled={runStatus === 'running' || !taskQueue.length}
              className="ideaai-primary-action h-[38px] rounded-full px-4 text-button-token font-medium transition-transform active:scale-95 disabled:opacity-35 shadow-sm"
            >
              {runStatus === 'running' ? 'Running Shift...' : 'Start Night Shift'}
            </button>
            <button type="button" onClick={() => void handleTestNightShift()} disabled={runStatus === 'running'} className="h-[38px] rounded-full border border-[#e0e0e0] dark:border-[#333333] px-4 text-xs font-medium text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#222222] disabled:opacity-35">
              Test Night Shift
            </button>
          </div>
        </div>

        {/* --- Content Body --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === 'queue' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Model Card, Schedule Card & Task Builder */}
              <div className="lg:col-span-7 space-y-5">
                {/* 1. Execution Model Card (24px radius, 16px-24px padding) */}
                <div className="flex items-center justify-between rounded-[24px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#161616] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.02)]">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-[16px] bg-[#f1f1f1] dark:bg-[#222222] text-[#000000] dark:text-[#ffffff]">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#000000] dark:text-[#ffffff]">
                        Execution Model: {activeOllamaModel}
                      </div>
                      <div className="text-xs text-[#666666] dark:text-[#999999] mt-0.5">
                        Hardware Tier: <span className="capitalize font-medium text-[#000000] dark:text-[#ffffff]">{profile?.tier || 'medium'}</span> · Context: {profile?.recommendedNumCtx || 8192} tokens
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab('hub')}
                    className="h-[32px] px-4 rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#1a1a1a] text-xs font-medium text-[#000000] dark:text-[#ffffff] hover:bg-[#f5f5f5] dark:hover:bg-[#222222] transition-colors"
                  >
                    Change Model
                  </button>
                </div>

                {/* 2. Schedule / Trigger Card (Reference 7) */}
                <div className="rounded-[24px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#161616] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-[#666666] dark:text-[#999999]" />
                      <h3 className="headline-lg text-sm font-medium">Schedule Trigger <span className="ml-1 rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] dark:bg-white/10">PRO</span></h3>
                    </div>
                    <span className="rounded-full bg-black/5 dark:bg-white/10 px-2.5 py-0.5 text-[11px] font-mono text-[#666666] dark:text-[#999999]">
                      {gmtOffset}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#666666] dark:text-[#999999] mb-1.5">
                        Frequency
                      </label>
                      <select
                        value={scheduleFrequency}
                        onChange={(e) => { if (!canUseNightShiftSchedule(plan)) { onUpgrade?.('OS WakeToRun scheduling is a Pro feature.'); return } setScheduleFrequency(e.target.value) }}
                        className="w-full h-[36px] rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-3.5 text-xs text-[#000000] dark:text-[#ffffff] outline-none"
                      >
                        <option>Every day</option>
                        <option>Weekdays only</option>
                        <option>Manual start only</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#666666] dark:text-[#999999] mb-1.5">
                        Trigger Time
                      </label>
                      <input
                        type="time"
                        value={scheduleTime}
                        onChange={(e) => { if (!canUseNightShiftSchedule(plan)) { onUpgrade?.('OS WakeToRun scheduling is a Pro feature.'); return } setScheduleTime(e.target.value) }}
                        className="w-full h-[36px] rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-3.5 text-xs text-[#000000] dark:text-[#ffffff] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Remote Worker */}
                <div className="rounded-[24px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#161616] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.02)]">
                  <button type="button" onClick={() => setRemoteWorkerOpen((open) => !open)} className="flex w-full items-center justify-between text-left">
                    <span><span className="block text-sm font-medium">Remote Worker (When PC is Powered Off)</span><span className="mt-1 block text-xs text-[#666666] dark:text-[#999999]">Optional private HTTPS, Tailscale, or SSH-connected worker.</span></span>
                    <span className="text-xs text-[#777777]">{remoteWorkerOpen ? 'Hide' : 'Configure'}</span>
                  </button>
                  {remoteWorkerOpen && <div className="mt-4 space-y-3">
                    <label className="flex items-center justify-between rounded-[14px] border border-[#e0e0e0] dark:border-[#333333] px-3 py-2 text-xs">Enable remote sync <span className="ml-auto mr-2 rounded-full bg-black/5 px-1.5 py-0.5 text-[9px] dark:bg-white/10">PRO</span><input type="checkbox" checked={remoteWorkerEnabled} onChange={(event) => { if (event.target.checked && !canUseRemoteWorker(plan)) { onUpgrade?.('Remote Worker is available on Turaen Pro.'); return } setRemoteWorkerEnabled(event.target.checked) }} className="accent-black dark:accent-white" /></label>
                    <input value={remoteWorkerEndpoint} onChange={(event) => setRemoteWorkerEndpoint(event.target.value)} placeholder="https://private-worker.example.com" className="h-[36px] w-full rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-4 text-xs outline-none" />
                    <input type="password" value={remoteWorkerToken} onChange={(event) => setRemoteWorkerToken(event.target.value)} placeholder="Optional bearer token" className="h-[36px] w-full rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-4 text-xs outline-none" />
                    <p className="text-[11px] text-[#777777] dark:text-[#999999]">Tasks sync privately when you start a shift. The local daemon remains zero-egress when remote sync is disabled.</p>
                  </div>}
                </div>

                {/* 3. Task Queue Builder */}
                <div className="rounded-[24px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#161616] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="headline-lg text-sm font-medium">Add Overnight Task</h3>
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
                      <GitBranch className="h-3 w-3" />
                      <span>Safe Git Sandbox auto-enabled</span>
                    </div>
                  </div>

                  <form onSubmit={handleAddTask} className="space-y-3">
                    <div>
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="e.g. Audit security dependencies and resolve all ESLint warnings"
                        className="w-full h-[40px] rounded-[16px] border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-4 text-xs text-[#000000] dark:text-[#ffffff] placeholder:text-[#999999] outline-none focus:border-black dark:focus:border-white"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={newTaskVerification}
                          onChange={(e) => setNewTaskVerification(e.target.value)}
                          placeholder="Verification command (e.g. npm test / npx tsc --noEmit)"
                          className="w-full h-[36px] rounded-full border border-[#e0e0e0] dark:border-[#333333] bg-white dark:bg-[#121212] px-4 text-xs font-mono text-[#000000] dark:text-[#ffffff] placeholder:text-[#999999] outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={!newTaskTitle.trim()}
                        className="ideaai-primary-action h-[38px] rounded-[40px] px-4 text-button-token font-medium transition-transform active:scale-95 disabled:opacity-30"
                      >
                        Add to Queue
                      </button>
                    </div>
                  </form>

                  {/* Queued Subtasks List */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs font-medium text-[#666666] dark:text-[#999999]">
                      Queued Subtasks ({taskQueue.length})
                    </div>
                    {taskQueue.map((t, idx) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between rounded-[16px] border border-[#e0e0e0] dark:border-[#262626] bg-white dark:bg-[#121212] p-3 text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-black/5 dark:bg-white/10 text-[10px] font-semibold">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="truncate font-medium text-[#000000] dark:text-[#ffffff]">{t.title}</div>
                            <div className="truncate font-mono text-[10px] text-[#888888]">
                              Verify: {t.verificationCommand}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveTask(t.id)}
                          className="text-[#999999] hover:text-red-500 transition-colors p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Live Stream & Execution Output */}
              <div className="lg:col-span-5 space-y-5">
                <div className="rounded-[24px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#161616] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] flex flex-col h-[520px]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#e0e0e0] dark:border-[#262626]">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 text-[#666666] dark:text-[#999999]" />
                      <h3 className="headline-lg text-sm font-medium">Execution Stream</h3>
                    </div>
                    {testStatus && <span className="max-w-[55%] truncate text-[10px] text-[#777777] dark:text-[#aaaaaa]">{testStatus}</span>}
                    {runStatus === 'running' && (
                      <button
                        type="button"
                        onClick={handleAbortRun}
                        className="h-[28px] px-3 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 text-[11px] font-medium"
                      >
                        Abort Shift
                      </button>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto mt-3 rounded-[16px] bg-[#101010] p-3 font-mono text-[11px] leading-5 text-gray-300">
                    {liveLogs.length === 0 ? (
                      <div className="text-gray-500 italic">No active task running. Start Night Shift to stream execution logs.</div>
                    ) : (
                      liveLogs.map((log, i) => (
                        <div key={i} className="flex gap-2">
                          <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                          <span className={log.level === 'error' ? 'text-red-400' : 'text-gray-300'}>{log.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hub' && (
            <div className="space-y-4">
              <div className="text-sm font-medium text-[#000000] dark:text-[#ffffff]">Local Models Catalog</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catalog.map((m) => (
                  <div key={m.id} className="rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#161616] p-4 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm">{m.name}</span>
                        {m.installed && <span className="rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[10px]">Installed</span>}
                      </div>
                      <p className="text-xs text-[#666666] dark:text-[#999999] mt-1">{m.description}</p>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-[#e0e0e0] dark:border-[#222222]">
                      <span className="text-[11px] font-mono text-[#888888]">{m.modelTag}</span>
                      <button
                        type="button"
                        onClick={() => {
                          if (requiresProForModel('Local (Ollama)', m.modelTag, plan)) { onUpgrade?.('This Night Shift model is included with Turaen Pro.'); return }
                          setActiveOllamaModel(m.modelTag)
                          setActiveTab('queue')
                        }}
                        className={`h-[28px] px-3 rounded-full text-xs font-medium ${
                          activeOllamaModel === m.modelTag
                            ? 'bg-[#2c2c2c] text-[#f5f5f5] ring-1 ring-[#404040]'
                            : 'border border-[#e0e0e0] dark:border-[#333333]'
                        }`}
                      >
                        {activeOllamaModel === m.modelTag ? 'Selected' : 'Use Model'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'audit' && (
            <div className="rounded-[20px] border border-[#e0e0e0] dark:border-[#262626] bg-[#fcfcfc] dark:bg-[#161616] p-5">
              <h3 className="headline-lg text-sm font-medium mb-3">Privacy Audit Log</h3>
              <p className="text-xs text-[#666666] dark:text-[#999999] mb-4">
                Strict Zero-Egress Guard monitors local sockets to ensure no model telemetry leaves your machine.
              </p>
              {recentBlockedLogs.length === 0 ? (
                <div className="text-xs text-[#888888] italic py-4">No blocked egress requests. System is operating securely offline.</div>
              ) : (
                <div className="space-y-2">
                  {recentBlockedLogs.map((log, idx) => (
                    <div key={idx} className="rounded-[12px] bg-red-500/5 border border-red-500/20 p-2.5 text-xs font-mono text-red-600 dark:text-red-400">
                      Blocked external outbound packet: {log.target} [{log.timestamp}]
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
