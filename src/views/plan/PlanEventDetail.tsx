import { useState } from 'react'
import {
  ArrowLeft,
  Clock,
  Heart,
  MapPin,
  Play,
  Share2,
  Ticket,
} from 'lucide-react'
import type { PlanPageEvent } from '../../types'

type PlanEventDetailProps = {
  data: PlanPageEvent
  variant: 'upcoming' | 'past'
  backAriaLabel?: string
  onBack: () => void
  onOpenEvent: (eventId: string) => void
  isFavorited: boolean
  onToggleFavorite: () => void
  /** Past events only: opens post-event review flow. */
  onOpenReview?: () => void
}

const waveformHeights = [
  14, 32, 22, 40, 18, 36, 26, 44, 20, 38, 16, 42, 24, 34, 30, 48, 12, 28, 36, 22, 40, 18,
]

export function PlanEventDetail({
  data,
  variant,
  backAriaLabel = 'Back to plan list',
  onBack,
  onOpenEvent,
  isFavorited,
  onToggleFavorite,
  onOpenReview,
}: PlanEventDetailProps) {
  const [playing, setPlaying] = useState(false)

  return (
    <div className="screen-content plan-page plan-event-detail">
      <header className="plan-toolbar">
        <button
          type="button"
          className="plan-toolbar-btn"
          aria-label={backAriaLabel}
          onClick={onBack}
        >
          <ArrowLeft size={22} strokeWidth={2} />
        </button>
        <p
          className={`plan-toolbar-status plan-toolbar-status--${variant}`}
          role="status"
        >
          {variant === 'upcoming' ? 'Upcoming' : 'Past'}
        </p>
        <button
          type="button"
          className="plan-toolbar-btn"
          aria-label={isFavorited ? 'Remove favorite' : 'Save event'}
          aria-pressed={isFavorited}
          onClick={onToggleFavorite}
        >
          <Heart
            size={20}
            strokeWidth={2}
            className={isFavorited ? 'plan-heart--on' : undefined}
            fill={isFavorited ? 'currentColor' : 'none'}
          />
        </button>
      </header>

      <div className="plan-main">
        <div className="plan-hero">
          <img
            className="plan-hero-img"
            src={data.heroImage}
            alt=""
            decoding="async"
          />
          <div className="plan-hero-scrim" aria-hidden />
          <div className="plan-hero-content">
            <div className="plan-hero-tags">
              <span className="plan-hero-tag">{data.genreTags[0]}</span>
              <span className="plan-hero-tag">{data.genreTags[1]}</span>
            </div>
            <h1 className="plan-hero-title">{data.displayTitle}</h1>
            <p className="plan-hero-artist">{data.artistLine}</p>
            <div className="plan-hero-meta">
              <span className="plan-hero-meta-row">
                <MapPin size={14} strokeWidth={2} aria-hidden />
                {data.venueLine}
              </span>
              <span className="plan-hero-meta-row">
                <Clock size={14} strokeWidth={2} aria-hidden />
                {data.timeRange}
              </span>
              {data.ticketPrice ? (
                <span className="plan-hero-meta-row">
                  <Ticket size={14} strokeWidth={2} aria-hidden />
                  {data.ticketPrice}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        <div className="plan-body">
          <div className="plan-stat-row">
            <div className="plan-stat-card plan-stat-card--vibe">
              <span className="plan-stat-label">AI VIBE SCORE</span>
              <div className="plan-vibe-score">
                <span className="plan-vibe-num">{data.aiVibeScore.toFixed(1)}</span>
                <span className="plan-vibe-denom">/10</span>
              </div>
            </div>
          </div>

          <section className="plan-section">
            <h2 className="plan-section-kicker">The Experience</h2>
            <p className="plan-copy">
              {data.experienceParts.before}
              <em className="plan-copy-accent">{data.experienceParts.emphasis}</em>
              {data.experienceParts.after}
            </p>
          </section>

          <div className="plan-audio">
            <button
              type="button"
              className="plan-audio-play"
              aria-pressed={playing}
              aria-label={playing ? 'Pause preview' : 'Play preview'}
              onClick={() => setPlaying((p) => !p)}
              disabled={variant === 'past'}
            >
              <Play size={22} fill="currentColor" aria-hidden />
            </button>
            <div className="plan-audio-mid">
              <div className="plan-wave" aria-hidden>
                {waveformHeights.map((h, i) => (
                  <span
                    key={i}
                    className={`plan-wave-bar${playing && i < 9 ? ' plan-wave-bar--hot' : ''}`}
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
              <div className="plan-audio-labels">
                <span className="plan-audio-track">{data.audioPreviewLabel}</span>
                <span className="plan-audio-time">
                  {data.audioCurrent} / {data.audioTotal}
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="plan-cta-rail">
        {variant === 'upcoming' ? (
          <button
            type="button"
            className="plan-cta-primary"
            onClick={() => onOpenEvent(data.eventId)}
          >
            I&apos;M GOING
          </button>
        ) : (
          <button type="button" className="plan-cta-primary plan-cta-primary--disabled" disabled>
            EVENT ENDED
          </button>
        )}
        <button
          type="button"
          className="plan-cta-review"
          disabled={variant === 'upcoming'}
          aria-label={
            variant === 'upcoming'
              ? 'Event review unlocks after the event'
              : 'Write an event review'
          }
          onClick={() => onOpenReview?.()}
        >
          EVENT REVIEW
        </button>
        <button type="button" className="plan-cta-secondary">
          <Share2 size={18} strokeWidth={2} aria-hidden />
          SHARE WITH FRIENDS
        </button>
      </div>
    </div>
  )
}
