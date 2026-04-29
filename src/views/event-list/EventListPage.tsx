import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Music, RefreshCw, AlertCircle } from 'lucide-react'
import { apiBase } from '../../lib/api-base'
import { mapRemoteEventRowToEventItem } from '../../lib/map-event'
import type { EventItem } from '../../types'
import './event-list.css'

type EventRow = {
  item: EventItem
  sourceUrl?: string
}

function eventsUrl(): string {
  const base = apiBase()
  if (!base) return '/api/events'
  return `${base}/api/events`
}

export function EventListPage() {
  const [rows, setRows] = useState<EventRow[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(eventsUrl(), { credentials: 'include' })
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string }
        setRows(null)
        setError(j.error ?? `HTTP ${res.status}`)
        return
      }
      const data = (await res.json()) as Record<string, unknown>[]
      if (!Array.isArray(data)) {
        setRows(null)
        setError('Invalid response: expected a JSON array')
        return
      }
      setRows(
        data.map((r) => ({
          item: mapRemoteEventRowToEventItem(r),
          sourceUrl: typeof r.source_url === 'string' ? r.source_url : undefined,
        })),
      )
    } catch (e) {
      setRows(null)
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return (
    <div
      className="event-list-root"
      style={{
        background: 'var(--bg)',
        color: 'var(--text)',
        padding: 'max(1rem, env(safe-area-inset-top)) 1rem 2rem',
      }}
    >
      <div className="event-list-inner">
        <header className="event-list-header">
          <div className="event-list-title-row">
            <Link to="/" className="event-list-back" aria-label="Back to app">
              <ArrowLeft size={20} strokeWidth={2} />
            </Link>
            <div>
              <h1 className="event-list-h1">Events</h1>
              <p className="event-list-sub">
                From <code className="event-list-code">/api/events</code> (Turso first)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="event-list-refresh"
          >
            <RefreshCw size={16} className={loading ? 'spin' : undefined} />
            Refresh
          </button>
        </header>

        {error && (
          <div className="event-list-alert" role="alert">
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <div>
              <p className="event-list-h1" style={{ fontSize: '0.9rem' }}>
                Could not load events
              </p>
              <p className="event-list-muted" style={{ marginTop: '0.25rem' }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {loading && !rows && !error && <p className="event-list-muted">Loading…</p>}

        {rows && rows.length === 0 && !loading && (
          <p className="event-list-muted">No events returned.</p>
        )}

        {rows && rows.length > 0 && (
          <ul className="event-list-list" aria-live="polite">
            {rows.map(({ item, sourceUrl }, idx) => (
              <li key={`${item.id ?? 'no-id'}-${idx}`} className="event-list-card">
                <div className="event-list-row">
                  <div className="event-list-thumb-wrap" aria-hidden>
                    <img src={item.image} alt="" className="event-list-thumb" loading="lazy" />
                  </div>
                  <div className="event-list-body">
                    <h2 className="event-list-h2">{item.title}</h2>
                    <p className="event-list-meta">
                      {item.venue} · {item.district}
                    </p>
                    <ul className="event-list-chips">
                      <li>
                        <Calendar size={12} aria-hidden />
                        {item.time || '—'}
                      </li>
                      <li>
                        <Music size={12} aria-hidden />
                        {item.genre}
                      </li>
                      {item.exploreCategoryId ? (
                        <li>
                          <MapPin size={12} aria-hidden />
                          cat {item.exploreCategoryId}
                        </li>
                      ) : null}
                      {item.locationCityId !== 'unknown' ? <li>{item.locationCityId}</li> : null}
                    </ul>
                    {sourceUrl ? (
                      <a
                        href={sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="event-list-source"
                        title={sourceUrl}
                      >
                        Source
                      </a>
                    ) : null}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
