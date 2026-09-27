import { useCallback, useEffect, useMemo, useState } from 'react'
import { Activity, ArrowLeft, RefreshCw } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { apiBase } from '../../lib/api-base'
import { useAppState } from '../../store/appStore'
import './status.css'

type ServiceState = 'operational' | 'degraded' | 'outage'

type ServiceStatus = {
  id: string
  name: string
  description: string
  state: ServiceState
  latencyMs: number | null
}

type HistoryPoint = {
  checkedAt: string
  overall: ServiceState
  services: Array<{ id: string; state: ServiceState }>
}

type StatusReport = {
  current: {
    checkedAt: string
    overall: ServiceState
    services: ServiceStatus[]
  }
  history: HistoryPoint[]
  monitoringWindowHours: number
  incident: {
    title: string
    message: string
    affectedServiceIds: string[]
    generatedAt: string
    source: "rule-based"
  } | null
}

const stateCopy: Record<ServiceState, { headline: string; label: string }> = {
  operational: { headline: 'All systems operational', label: 'Operational' },
  degraded: { headline: 'Some systems are degraded', label: 'Degraded performance' },
  outage: { headline: 'Service disruption detected', label: 'Major outage' },
}

function relativeTime(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

function serviceHistory(report: StatusReport, serviceId: string): ServiceState[] {
  return report.history.flatMap((point) => {
    const service = point.services.find((candidate) => candidate.id === serviceId)
    return service ? [service.state] : []
  })
}

function uptimeLabel(states: ServiceState[]): string {
  if (states.length < 2) return 'Collecting data'
  const healthy = states.filter((state) => state === 'operational').length
  return `${((healthy / states.length) * 100).toFixed(2)}% uptime`
}

export function StatusPage() {
  const [report, setReport] = useState<StatusReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [, setClock] = useState(0)
  const location = useLocation()
  const navigate = useNavigate()
  const openSettings = useAppState((state) => state.openSettings)
  const returnToSettings =
    typeof location.state === 'object' &&
    location.state !== null &&
    'returnToSettings' in location.state &&
    location.state.returnToSettings === true

  const handleBack = () => {
    if (returnToSettings) {
      openSettings()
      navigate('/profile')
      return
    }
    navigate('/discover')
  }

  const loadStatus = useCallback(async (background = false) => {
    if (!background) setRefreshing(true)
    try {
      const response = await fetch(`${apiBase()}/api/status`, {
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) throw new Error(`Status API returned HTTP ${response.status}`)
      setReport((await response.json()) as StatusReport)
      setError(null)
    } catch {
      setError('Live status is temporarily unavailable. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadStatus()
    const refresh = window.setInterval(() => void loadStatus(true), 60_000)
    const clock = window.setInterval(() => setClock((value) => value + 1), 30_000)
    return () => {
      window.clearInterval(refresh)
      window.clearInterval(clock)
    }
  }, [loadStatus])

  const affectedServices = useMemo(
    () => report?.current.services.filter((service) => service.state !== 'operational') ?? [],
    [report],
  )

  const overall = report?.current.overall ?? 'degraded'
  const copy = stateCopy[overall]

  return (
    <main className="status-page">
      <header className="status-header">
        <button type="button" className="status-back-link" onClick={handleBack}>
          <ArrowLeft size={16} aria-hidden />
          {returnToSettings ? 'Back to settings' : 'Back to app'}
        </button>
        <Link className="status-brand" to="/discover" aria-label="Buzo home">
          <img
            className="status-brand-mark"
            src="/assets/logo/b-logo.svg"
            alt=""
            width={32}
            height={32}
          />
        </Link>
      </header>

      <div className="status-shell">
        <section className={`status-hero status-tone--${overall}`} aria-labelledby="status-title">
          <div className="status-hero-icon" aria-hidden>
            <Activity size={24} strokeWidth={2.2} />
          </div>
          <div>
            <p className="status-eyebrow">Buzo system status</p>
            <h1 id="status-title">{report ? copy.headline : 'Checking our systems'}</h1>
            <p>
              {report
                ? 'Live checks across the services that power discovery, planning, and accounts.'
                : 'Running independent checks across our critical services.'}
            </p>
          </div>
        </section>

        <div className="status-meta" aria-live="polite">
          <span>
            {report
              ? `Last checked ${relativeTime(report.current.checkedAt)}`
              : error ?? 'Connecting to live status…'}
          </span>
          <button type="button" onClick={() => void loadStatus()} disabled={refreshing}>
            <RefreshCw size={15} className={refreshing ? 'status-spin' : ''} aria-hidden />
            Refresh
          </button>
        </div>

        {error ? (
          <section className="status-notice status-notice--error" role="alert">
            <div>
              <h2>Unable to load live status</h2>
              <p>{error}</p>
            </div>
            <button type="button" onClick={() => void loadStatus()}>Try again</button>
          </section>
        ) : null}

        <section className="status-section" aria-labelledby="systems-heading">
          <div className="status-section-heading">
            <div>
              <p className="status-eyebrow">Live services</p>
              <h2 id="systems-heading">System status</h2>
            </div>
            {report ? <span>Last {report.monitoringWindowHours} hours</span> : null}
          </div>

          <div className="status-service-list">
            {report ? report.current.services.map((service) => {
              const history = serviceHistory(report, service.id)
              return (
                <article className="status-service" key={service.id}>
                  <div className="status-service-copy">
                    <div>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                    </div>
                    <span className={`status-state status-state--${service.state}`}>
                      <i aria-hidden />
                      {stateCopy[service.state].label}
                    </span>
                  </div>
                  <div
                    className="status-history"
                    role="img"
                    aria-label={`${service.name}: ${uptimeLabel(history)} over ${history.length} collected checks`}
                  >
                    {history.map((state, index) => (
                      <i className={`status-history-bar status-history-bar--${state}`} key={`${service.id}-${index}`} />
                    ))}
                    {history.length < 24
                      ? Array.from({ length: 24 - history.length }, (_, index) => (
                          <i className="status-history-bar status-history-bar--empty" key={`empty-${index}`} />
                        ))
                      : null}
                  </div>
                  <div className="status-service-foot">
                    <span>{uptimeLabel(history)}</span>
                    <span>{service.latencyMs === null ? 'No latency data' : `${service.latencyMs} ms`}</span>
                  </div>
                </article>
              )
            }) : Array.from({ length: 4 }, (_, index) => (
              <div className="status-service status-service--loading" key={index} aria-hidden>
                <i /><i /><i />
              </div>
            ))}
          </div>
        </section>

        <section className="status-section status-incidents" aria-labelledby="incidents-heading">
          <div className="status-section-heading">
            <div>
              <p className="status-eyebrow">Current incidents</p>
              <h2 id="incidents-heading">Incidents</h2>
            </div>
          </div>
          {report && affectedServices.length === 0 ? (
            <div className="status-empty">
              <span className="status-empty-check" aria-hidden>✓</span>
              <div>
                <h3>No active incidents</h3>
                <p>We’re not aware of any issues affecting Buzo right now.</p>
              </div>
            </div>
          ) : report ? (
            <div className="status-incident-list">
              {report.incident ? (
                <article className="status-incident-update">
                  <span className={`status-state status-state--${report.current.overall}`}>
                    {report.current.overall === "outage" ? "Investigating" : "Monitoring"}
                  </span>
                  <h3>{report.incident.title}</h3>
                  <p>{report.incident.message}</p>
                  <span className="status-incident-meta">
                    Rule-based update ·{" "}
                    {relativeTime(report.incident.generatedAt)}
                  </span>
                </article>
              ) : null}
              {affectedServices.map((service) => (
                <article key={service.id}>
                  <span className={`status-state status-state--${service.state}`}>{stateCopy[service.state].label}</span>
                  <h3>{service.name}</h3>
                  <p>Automated checks are failing. We’re investigating the affected integration.</p>
                </article>
              ))}
            </div>
          ) : (
            <p className="status-muted">Checking for active incidents…</p>
          )}
        </section>

        <footer className="status-footer">
          <span>Automated checks every 15 minutes</span>
        </footer>
      </div>
    </main>
  )
}
