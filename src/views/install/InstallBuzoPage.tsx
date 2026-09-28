import { useEffect, useState } from 'react'
import { ArrowLeft, Download, Share, Smartphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  getPwaInstallState,
  requestPwaInstall,
  subscribeToPwaInstall,
} from '../../lib/pwa-install'
import { BuzoWordmark } from '../../components/BuzoWordmark'
import './install-buzo.css'

export function InstallBuzoPage() {
  const navigate = useNavigate()
  const [installState, setInstallState] = useState(getPwaInstallState)

  useEffect(() => subscribeToPwaInstall(setInstallState), [])

  const install = () => {
    if (installState.platform === 'android' && installState.canPrompt) {
      void requestPwaInstall().then((prompted) => {
        if (!prompted) setInstallState(getPwaInstallState())
      })
    }
  }

  const isIos = installState.platform === 'ios'
  const isAndroid = installState.platform === 'android'

  return (
    <main className="install-buzo-page">
      <header className="install-buzo-header">
        <button type="button" className="install-buzo-back" onClick={() => navigate('/profile')}>
          <ArrowLeft size={19} aria-hidden />
          Back to profile
        </button>
        <BuzoWordmark className="install-buzo-wordmark" alt="Buzo" />
      </header>

      <section className="install-buzo-content" aria-labelledby="install-buzo-title">
        <span className="install-buzo-icon" aria-hidden>
          <Smartphone size={32} />
        </span>
        <p className="install-buzo-eyebrow">Buzo on your home screen</p>
        <h1 id="install-buzo-title">
          {installState.isInstalled ? 'Buzo is installed' : 'Install Buzo'}
        </h1>
        <p className="install-buzo-lead">
          {installState.isInstalled
            ? 'You can open Buzo straight from your home screen.'
            : 'Get faster access and a cleaner, app-like experience on your phone.'}
        </p>

        {!installState.isInstalled && isAndroid && installState.canPrompt ? (
          <button type="button" className="install-buzo-primary" onClick={install}>
            <Download size={18} aria-hidden />
            Install Buzo
          </button>
        ) : null}

        {!installState.isInstalled && isIos ? (
          <ol className="install-buzo-steps">
            <li>
              <Share size={18} aria-hidden />
              <span>Tap the <strong>Share</strong> button in Safari.</span>
            </li>
            <li>
              <span className="install-buzo-step-number">2</span>
              <span>Choose <strong>Add to Home Screen</strong>.</span>
            </li>
            <li>
              <span className="install-buzo-step-number">3</span>
              <span>Tap <strong>Add</strong> to install Buzo.</span>
            </li>
          </ol>
        ) : null}

        {!installState.isInstalled && isAndroid && !installState.canPrompt ? (
          <div className="install-buzo-note">
            <h2>Install from Chrome</h2>
            <p>Open Buzo in Chrome, then choose <strong>Install app</strong> or <strong>Add to Home screen</strong> from the browser menu.</p>
          </div>
        ) : null}

        {installState.platform === 'other' ? (
          <div className="install-buzo-note">
            <h2>Open this on your phone</h2>
            <p>Install Buzo from Safari on iPhone, or Chrome on Android.</p>
          </div>
        ) : null}
      </section>
    </main>
  )
}
