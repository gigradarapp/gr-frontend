import type { EventItem } from '../types'

function formatTimeLabel(timeRaw: string): string {
  const d = new Date(timeRaw)
  return Number.isFinite(d.getTime())
    ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''
}

/** Row from `events.list` (PostgREST snake_case). */
export function mapDbEventToEventItem(row: Record<string, unknown>): EventItem {
  const time = formatTimeLabel(String(row.event_time ?? ''))

  return {
    id: row.id as string,
    title: row.title as string,
    venue: row.venue as string,
    district: row.district as string,
    time,
    genre: row.genre as string,
    exploreCategoryId: row.explore_category_id as string,
    locationCityId: row.location_city_id as string,
    verified: Number(row.verified ?? 0),
    image: row.image as string,
    host: row.host as string,
    hostPrompt: (row.host_prompt as string) ?? '',
    friendsGoing: Number(row.friends_going ?? 0),
    vibeTags: Array.isArray(row.vibe_tags) ? (row.vibe_tags as string[]) : [],
    ticketPrice: String(row.ticket_price ?? ''),
    bpReward: row.bp_reward != null ? Number(row.bp_reward) : undefined,
    buzzPct: row.buzz_pct != null ? Number(row.buzz_pct) : undefined,
    lat: row.lat != null ? Number(row.lat) : undefined,
    lng: row.lng != null ? Number(row.lng) : undefined,
  }
}

const REMOTE_PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80'

/**
 * `/api/events` and Turso-backed rows: tolerates `row_num` instead of `id`, integer category ids,
 * and missing optional Buzo columns (image, vibe_tags, city, etc.).
 */
export function mapRemoteEventRowToEventItem(row: Record<string, unknown>): EventItem {
  const id =
    row.id != null && String(row.id).length > 0
      ? String(row.id)
      : String(row.row_num ?? '')

  const time = formatTimeLabel(String(row.event_time ?? ''))
  const cat = row.explore_category_id
  const exploreCategoryId =
    cat == null || cat === '' ? '' : String(cat)

  return {
    id,
    title: String(row.title ?? ''),
    venue: String(row.venue ?? ''),
    district: String(row.district ?? ''),
    time,
    genre: String(row.genre ?? ''),
    exploreCategoryId,
    locationCityId:
      row.location_city_id != null && String(row.location_city_id).length > 0
        ? String(row.location_city_id)
        : 'unknown',
    verified: Number(row.verified ?? 0),
    image: (row.image as string)?.trim() ? String(row.image) : REMOTE_PLACEHOLDER_IMAGE,
    host: String(row.host ?? ''),
    hostPrompt: String(row.host_prompt ?? ''),
    friendsGoing: Number(row.friends_going ?? 0),
    vibeTags: Array.isArray(row.vibe_tags) ? (row.vibe_tags as string[]) : [],
    ticketPrice: row.ticket_price == null || row.ticket_price === '' ? '' : String(row.ticket_price),
    bpReward: row.bp_reward != null ? Number(row.bp_reward) : undefined,
    buzzPct: row.buzz_pct != null ? Number(row.buzz_pct) : undefined,
    lat: row.lat != null ? Number(row.lat) : undefined,
    lng: row.lng != null ? Number(row.lng) : undefined,
  }
}
