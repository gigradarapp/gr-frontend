import type { FeedWireframePost } from '../types'

type FeedProfile = {
  display_name?: string | null
  username?: string | null
  avatar_url?: string | null
} | null

type FeedEvent = {
  title?: string | null
  venue?: string | null
  district?: string | null
  image?: string | null
  location_city_id?: string | null
} | null

export type FeedPostRow = {
  event_id: string
  host_verb: 'asked' | 'scrawled'
  host_line: string
  kicker: string
  kicker_style: 'neon' | 'quote'
  hero_image: string
  bp: number
  buzz_pct: number | null
  profiles?: FeedProfile
  events?: FeedEvent
}

const defaultAvatar =
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'

export function mapFeedRowToWireframe(row: FeedPostRow): FeedWireframePost {
  const p = row.profiles
  const host = (p?.display_name?.trim() || p?.username?.trim() || 'Host').trim()
  const avatar = p?.avatar_url?.trim() || defaultAvatar
  const ev = row.events
  const venueName = (ev?.title?.trim() || 'Venue').trim()
  const venueLine = ev ? `${ev.venue ?? ''} · ${ev.district ?? ''}`.trim() : ''
  const heroImage = row.hero_image?.trim() || ev?.image?.trim() || ''

  return {
    eventId: row.event_id,
    host,
    hostAvatar: avatar,
    hostVerb: row.host_verb,
    hostLine: row.host_line,
    bp: row.bp,
    buzzPct: row.buzz_pct ?? undefined,
    heroImage,
    kicker: row.kicker,
    kickerStyle: row.kicker_style,
    venueName: venueName.toUpperCase(),
    venueLine: venueLine.toUpperCase(),
    imageGrayscale: row.kicker_style === 'quote',
  }
}
