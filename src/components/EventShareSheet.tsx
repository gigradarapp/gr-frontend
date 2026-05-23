import { X } from 'lucide-react'

type EventShareSheetProps = {
  title: string
  venue?: string
  when?: string
  url?: string | null
  fallbackPath?: string
  onClose: () => void
}

function absoluteUrl(path: string): string {
  if (typeof window === 'undefined') return path
  return new URL(path, window.location.origin).toString()
}

function resolveTargetUrl(url?: string | null, fallbackPath?: string): string {
  const trimmed = url?.trim()
  if (trimmed && /^https?:\/\//i.test(trimmed)) return trimmed
  return absoluteUrl(fallbackPath ?? '/discover')
}

function shareText(title: string, venue?: string, when?: string): string {
  const lines = [title.trim()]
  if (when?.trim()) lines.push(`When: ${when.trim()}`)
  if (venue?.trim()) lines.push(`Where: ${venue.trim()}`)
  return lines.join('\n')
}

export function EventShareSheet({
  title,
  venue,
  when,
  url,
  fallbackPath,
  onClose,
}: EventShareSheetProps) {
  const targetUrl = resolveTargetUrl(url, fallbackPath)
  const text = shareText(title, venue, when)
  const encodedUrl = encodeURIComponent(targetUrl)
  const encodedText = encodeURIComponent(text)

  const openShareTarget = (shareUrl: string) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer')
  }

  const onCopy = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(targetUrl)
      return
    }
    window.prompt('Copy event link', targetUrl)
  }

  return (
    <div className="event-share-backdrop" onClick={onClose}>
      <div className="event-share-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="event-share-head">
          <h3>Share Event</h3>
          <button type="button" className="event-share-close" aria-label="Close share sheet" onClick={onClose}>
            <X size={20} strokeWidth={2.4} />
          </button>
        </div>

        <div className="event-share-grid" role="group" aria-label="Share targets">
          <button type="button" className="event-share-target" onClick={() => openShareTarget(`https://wa.me/?text=${encodedText}%20${encodedUrl}`)}>
            <span className="event-share-target-dot">WA</span>
            <span>WhatsApp</span>
          </button>
          <button type="button" className="event-share-target" onClick={() => openShareTarget(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`)}>
            <span className="event-share-target-dot">TG</span>
            <span>Telegram</span>
          </button>
          <button type="button" className="event-share-target" onClick={() => openShareTarget(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`)}>
            <span className="event-share-target-dot">X</span>
            <span>X</span>
          </button>
          <button type="button" className="event-share-target" onClick={() => openShareTarget(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`)}>
            <span className="event-share-target-dot">f</span>
            <span>Facebook</span>
          </button>
        </div>

        <div className="event-share-link-row">
          <input type="text" value={targetUrl} readOnly aria-label="Share link" />
          <button type="button" className="event-share-copy" onClick={() => { void onCopy() }}>
            Copy
          </button>
        </div>
      </div>
    </div>
  )
}
