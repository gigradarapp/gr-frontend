/**
 * Plan “Explore events” category metadata (labels, demo counts).
 * Discover feed filter chips and onboarding genre step use the same ids as `EventItem.exploreCategoryId`.
 */

export type ExploreCategoryDef = {
  id: string
  label: string
  countLabel: string
  accent: string
  /** Subtitle on onboarding “What moves you?” (monospace line under title). */
  filterSub: string
}

export const EXPLORE_CATEGORY_DEFS: ExploreCategoryDef[] = [
  {
    id: 'live-music',
    label: 'Live Music',
    countLabel: '5K events',
    accent: '#ca8a04',
    filterSub: 'Bands. Sets. Energy.',
  },
  {
    id: 'club-nights',
    label: 'Club Nights',
    countLabel: '4K events',
    accent: '#db2777',
    filterSub: 'Dance til dawn.',
  },
  {
    id: 'jazz-blues',
    label: 'Jazz & Blues',
    countLabel: '2K events',
    accent: '#ea580c',
    filterSub: 'Late night smoke.',
  },
  {
    id: 'underground',
    label: 'Underground',
    countLabel: '1K events',
    accent: '#16a34a',
    filterSub: 'Off the map.',
  },
  {
    id: 'arts',
    label: 'Arts & Culture',
    countLabel: '2K events',
    accent: '#059669',
    filterSub: 'Openings. Shows.',
  },
  {
    id: 'food',
    label: 'Food & Drink',
    countLabel: '3K events',
    accent: '#e11d48',
    filterSub: 'Bars. Bites. Social.',
  },
  {
    id: 'popups',
    label: 'Pop-ups',
    countLabel: '800 events',
    accent: '#0d9488',
    filterSub: 'Here today, gone.',
  },
  {
    id: 'festivals',
    label: 'Festivals',
    countLabel: '120 events',
    accent: '#9333ea',
    filterSub: 'Big stages. Big nights.',
  },
]

/**
 * Discover tab → Filter sheet → Category section (order matches UI).
 * `id` is `EventItem.exploreCategoryId`; use `'All'` for no category filter.
 */
export const DISCOVER_FEED_CATEGORY_FILTER_OPTIONS: ReadonlyArray<{ id: string; label: string }> = [
  { id: 'All', label: 'All' },
  ...EXPLORE_CATEGORY_DEFS.map((c) => ({ id: c.id, label: c.label })),
]

/**
 * Maps Discover category id → `taste_categories` labels for onboarding / profile taste save.
 */
export const EXPLORE_CATEGORY_TO_TASTE_LABELS: Record<string, readonly string[]> = {
  'live-music': ['POST-PUNK', 'NEW BEAT'],
  'club-nights': ['MINIMAL TECHNO', 'ACID HOUSE', 'TECH HOUSE'],
  'jazz-blues': ['DARK DISCO', 'DEEP HOUSE'],
  underground: ['INDUSTRIAL', 'EBM', 'GABBER'],
  arts: ['POST-PUNK', 'ITALO DISCO'],
  food: ['ITALO DISCO', 'DEEP HOUSE', 'NEW BEAT'],
  popups: ['NEW BEAT', 'ITALO DISCO'],
  festivals: ['ACID HOUSE', 'GABBER', 'TECH HOUSE'],
}

export function getExploreCategoryDef(categoryId: string): ExploreCategoryDef | undefined {
  return EXPLORE_CATEGORY_DEFS.find((c) => c.id === categoryId)
}
