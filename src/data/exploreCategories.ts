/**
 * Plan “Explore events” category metadata (labels, demo counts).
 * Pair with icon map in `PlanExploreEvents` / filtering via `EventItem.exploreCategoryId`.
 */

export type ExploreCategoryDef = {
  id: string
  label: string
  countLabel: string
  accent: string
}

export const EXPLORE_CATEGORY_DEFS: ExploreCategoryDef[] = [
  { id: 'tech', label: 'Tech', countLabel: '5K events', accent: '#ca8a04' },
  { id: 'food', label: 'Food & Drink', countLabel: '3K events', accent: '#ea580c' },
  { id: 'ai', label: 'AI', countLabel: '3K events', accent: '#db2777' },
  { id: 'arts', label: 'Arts & Culture', countLabel: '2K events', accent: '#16a34a' },
  { id: 'climate', label: 'Climate', countLabel: '1K events', accent: '#059669' },
  { id: 'fitness', label: 'Fitness', countLabel: '2K events', accent: '#e11d48' },
  { id: 'wellness', label: 'Wellness', countLabel: '3K events', accent: '#0d9488' },
  { id: 'crypto', label: 'Crypto', countLabel: '804 events', accent: '#9333ea' },
]

export function getExploreCategoryDef(categoryId: string): ExploreCategoryDef | undefined {
  return EXPLORE_CATEGORY_DEFS.find((c) => c.id === categoryId)
}
