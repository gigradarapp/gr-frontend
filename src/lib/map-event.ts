import type { EventItem } from '../types'

/** Row from `events.list` (PostgREST snake_case + optional `event_rsvps` embed). */
export function mapDbEventToEventItem(row: Record<string, unknown>): EventItem {
  const timeRaw = row.event_time as string
  const d = new Date(timeRaw)
  const time = Number.isFinite(d.getTime())
    ? d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })
    : ''

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
