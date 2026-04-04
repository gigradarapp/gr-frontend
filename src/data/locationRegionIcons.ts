import type { LucideIcon } from 'lucide-react'
import {
  Building2,
  Castle,
  Church,
  Factory,
  FerrisWheel,
  Landmark,
  Mountain,
  TreePalm,
} from 'lucide-react'
import { LOCATION_REGIONS, type LocationCity, type LocationIconKey, type LocationRegion } from './locationRegions'

export const LOCATION_ICON_MAP: Record<LocationIconKey, LucideIcon> = {
  building2: Building2,
  castle: Castle,
  church: Church,
  factory: Factory,
  ferrisWheel: FerrisWheel,
  landmark: Landmark,
  mountain: Mountain,
  treePalm: TreePalm,
}

export type ExploreLocalCity = {
  id: string
  name: string
  events: number
  accent: string
  Icon: LucideIcon
}

export type ExploreLocalRegion = {
  id: string
  label: string
  cities: ExploreLocalCity[]
}

function enrichCity(c: LocationCity): ExploreLocalCity {
  return {
    id: c.id,
    name: c.name,
    events: c.events,
    accent: c.accent,
    Icon: LOCATION_ICON_MAP[c.iconKey],
  }
}

export function enrichLocationRegions(regions: LocationRegion[]): ExploreLocalRegion[] {
  return regions.map((r) => ({
    id: r.id,
    label: r.label,
    cities: r.cities.map(enrichCity),
  }))
}

/** Plan explore-local grid: same cities as Feed / `LOCATION_REGIONS`, with Lucide icons resolved. */
export const EXPLORE_LOCAL_REGIONS: ExploreLocalRegion[] = enrichLocationRegions(LOCATION_REGIONS)
