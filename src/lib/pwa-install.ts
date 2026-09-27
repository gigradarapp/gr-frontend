export type PwaPlatform = 'ios' | 'android' | 'other'

type DeferredInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type PwaInstallState = {
  platform: PwaPlatform
  isInstalled: boolean
  canPrompt: boolean
}

let deferredPrompt: DeferredInstallPromptEvent | null = null
let initialized = false
const listeners = new Set<(state: PwaInstallState) => void>()

function platform(): PwaPlatform {
  if (typeof navigator === 'undefined') return 'other'
  const userAgent = navigator.userAgent
  const isIos =
    /iPad|iPhone|iPod/.test(userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (isIos) return 'ios'
  if (/Android/i.test(userAgent)) return 'android'
  return 'other'
}

function isInstalled(): boolean {
  if (typeof window === 'undefined') return false
  const navigatorWithStandalone = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || navigatorWithStandalone.standalone === true
}

export function getPwaInstallState(): PwaInstallState {
  return {
    platform: platform(),
    isInstalled: isInstalled(),
    canPrompt: deferredPrompt !== null,
  }
}

function notify() {
  const state = getPwaInstallState()
  listeners.forEach((listener) => listener(state))
}

export function initializePwaInstall() {
  if (initialized || typeof window === 'undefined') return
  initialized = true

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    deferredPrompt = event as DeferredInstallPromptEvent
    notify()
  })
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null
    notify()
  })
  window.matchMedia('(display-mode: standalone)').addEventListener('change', notify)
}

export function subscribeToPwaInstall(listener: (state: PwaInstallState) => void): () => void {
  listeners.add(listener)
  listener(getPwaInstallState())
  return () => listeners.delete(listener)
}

export async function requestPwaInstall(): Promise<boolean> {
  if (!deferredPrompt) return false
  const prompt = deferredPrompt
  deferredPrompt = null
  await prompt.prompt()
  await prompt.userChoice
  notify()
  return true
}

export function registerPwaServiceWorker() {
  if (!('serviceWorker' in navigator)) return
  window.addEventListener('load', () => {
    void navigator.serviceWorker.register('/sw.js').catch(() => undefined)
  })
}
