import type { TasteIdentityItem } from './profileIdentity'
import { EXPLORE_CATEGORY_DEFS, EXPLORE_CATEGORY_TO_TASTE_LABELS } from './exploreCategories'

export type OnboardingGenre = {
  /** Same as Discover filter / `EventItem.exploreCategoryId`. */
  id: string
  label: string
  sub: string
}

/** Genre rows on onboarding step 2 — synced with Discover → Filter → Category. */
export const ONBOARDING_GENRES: OnboardingGenre[] = EXPLORE_CATEGORY_DEFS.map((c) => ({
  id: c.id,
  label: c.label,
  sub: c.filterSub,
}))

export function buildTasteItemsFromOnboardingSelection(
  selectedExploreCategoryIds: string[],
  catalogItems: TasteIdentityItem[],
): TasteIdentityItem[] {
  const highlight = new Set<string>()
  for (const id of selectedExploreCategoryIds) {
    const labels = EXPLORE_CATEGORY_TO_TASTE_LABELS[id]
    if (labels) for (const l of labels) highlight.add(l)
  }
  return catalogItems.map((item) => ({
    ...item,
    accent: highlight.has(item.label),
  }))
}

/** Infer category picks from saved taste accents (same ids as Discover filter). */
export function deriveOnboardingGenreIdsFromTastes(items: TasteIdentityItem[]): string[] {
  const accented = new Set(items.filter((i) => i.accent).map((i) => i.label))
  const selected: string[] = []
  for (const g of ONBOARDING_GENRES) {
    const labels = EXPLORE_CATEGORY_TO_TASTE_LABELS[g.id] ?? []
    if (labels.some((l) => accented.has(l))) selected.push(g.id)
  }
  return selected
}
