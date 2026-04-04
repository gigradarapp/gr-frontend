/**
 * Shared regions / cities for Feed location filter, Plan explore-local, etc.
 * Add cities here only — UI reads from this file.
 */

export type LocationIconKey =
  | 'building2'
  | 'castle'
  | 'church'
  | 'factory'
  | 'ferrisWheel'
  | 'landmark'
  | 'mountain'
  | 'treePalm'

export type LocationCity = {
  /** Stable id (kebab-case), unique across all cities */
  id: string
  name: string
  events: number
  accent: string
  iconKey: LocationIconKey
}

export type LocationRegion = {
  id: string
  label: string
  cities: LocationCity[]
}

export const LOCATION_REGIONS: LocationRegion[] = [
  {
    id: 'asia',
    label: 'Asia & Pacific',
    cities: [
      { id: 'singapore', name: 'Singapore', events: 14, accent: '#7c3aed', iconKey: 'landmark' },
      { id: 'bangkok', name: 'Bangkok', events: 30, accent: '#d97706', iconKey: 'ferrisWheel' },
      { id: 'seoul', name: 'Seoul', events: 22, accent: '#ca8a04', iconKey: 'factory' },
      { id: 'sydney', name: 'Sydney', events: 18, accent: '#2563eb', iconKey: 'building2' },
      { id: 'dubai', name: 'Dubai', events: 26, accent: '#0d9488', iconKey: 'building2' },
      { id: 'tokyo', name: 'Tokyo', events: 40, accent: '#db2777', iconKey: 'castle' },
      { id: 'hong-kong', name: 'Hong Kong', events: 19, accent: '#ea580c', iconKey: 'church' },
      { id: 'mumbai', name: 'Mumbai', events: 24, accent: '#4f46e5', iconKey: 'landmark' },
      { id: 'jakarta', name: 'Jakarta', events: 16, accent: '#059669', iconKey: 'building2' },
      { id: 'manila', name: 'Manila', events: 12, accent: '#e11d48', iconKey: 'ferrisWheel' },
      { id: 'kuala-lumpur', name: 'Kuala Lumpur', events: 11, accent: '#7c2d12', iconKey: 'landmark' },
      { id: 'auckland', name: 'Auckland', events: 4, accent: '#9333ea', iconKey: 'treePalm' },
      { id: 'melbourne', name: 'Melbourne', events: 17, accent: '#0891b2', iconKey: 'building2' },
      { id: 'taipei', name: 'Taipei', events: 15, accent: '#65a30d', iconKey: 'factory' },
      { id: 'bali', name: 'Bali', events: 9, accent: '#f97316', iconKey: 'treePalm' },
      { id: 'osaka', name: 'Osaka', events: 21, accent: '#be123c', iconKey: 'castle' },
      { id: 'hanoi', name: 'Hanoi', events: 10, accent: '#15803d', iconKey: 'landmark' },
      { id: 'phuket', name: 'Phuket', events: 8, accent: '#0ea5e9', iconKey: 'treePalm' },
      { id: 'chennai', name: 'Chennai', events: 7, accent: '#c026d3', iconKey: 'building2' },
      { id: 'ho-chi-minh', name: 'Ho Chi Minh', events: 13, accent: '#b45309', iconKey: 'church' },
    ],
  },
  {
    id: 'africa',
    label: 'Africa',
    cities: [
      { id: 'lagos', name: 'Lagos', events: 11, accent: '#ea580c', iconKey: 'building2' },
      { id: 'cairo', name: 'Cairo', events: 24, accent: '#ca8a04', iconKey: 'landmark' },
      { id: 'cape-town', name: 'Cape Town', events: 9, accent: '#0891b2', iconKey: 'mountain' },
      { id: 'nairobi', name: 'Nairobi', events: 6, accent: '#16a34a', iconKey: 'treePalm' },
      { id: 'marrakech', name: 'Marrakech', events: 8, accent: '#dc2626', iconKey: 'castle' },
      { id: 'accra', name: 'Accra', events: 5, accent: '#7c3aed', iconKey: 'church' },
      { id: 'johannesburg', name: 'Johannesburg', events: 12, accent: '#64748b', iconKey: 'factory' },
      { id: 'tunis', name: 'Tunis', events: 7, accent: '#0d9488', iconKey: 'landmark' },
    ],
  },
  {
    id: 'europe',
    label: 'Europe',
    cities: [
      { id: 'london', name: 'London', events: 52, accent: '#4f46e5', iconKey: 'building2' },
      { id: 'berlin', name: 'Berlin', events: 38, accent: '#b91c1c', iconKey: 'ferrisWheel' },
      { id: 'paris', name: 'Paris', events: 45, accent: '#2563eb', iconKey: 'landmark' },
      { id: 'amsterdam', name: 'Amsterdam', events: 23, accent: '#ca8a04', iconKey: 'church' },
      { id: 'barcelona', name: 'Barcelona', events: 29, accent: '#ea580c', iconKey: 'castle' },
      { id: 'vienna', name: 'Vienna', events: 14, accent: '#be123c', iconKey: 'church' },
      { id: 'prague', name: 'Prague', events: 11, accent: '#7c3aed', iconKey: 'castle' },
      { id: 'lisbon', name: 'Lisbon', events: 16, accent: '#059669', iconKey: 'treePalm' },
      { id: 'milan', name: 'Milan', events: 19, accent: '#0f766e', iconKey: 'factory' },
      { id: 'dublin', name: 'Dublin', events: 10, accent: '#15803d', iconKey: 'landmark' },
    ],
  },
  {
    id: 'north-america',
    label: 'North America',
    cities: [
      { id: 'new-york', name: 'New York', events: 61, accent: '#6d28d9', iconKey: 'building2' },
      { id: 'los-angeles', name: 'Los Angeles', events: 48, accent: '#ea580c', iconKey: 'ferrisWheel' },
      { id: 'toronto', name: 'Toronto', events: 27, accent: '#0369a1', iconKey: 'landmark' },
      { id: 'mexico-city', name: 'Mexico City', events: 33, accent: '#b45309', iconKey: 'church' },
      { id: 'miami', name: 'Miami', events: 25, accent: '#ec4899', iconKey: 'treePalm' },
      { id: 'chicago', name: 'Chicago', events: 22, accent: '#475569', iconKey: 'factory' },
      { id: 'vancouver', name: 'Vancouver', events: 14, accent: '#0d9488', iconKey: 'mountain' },
      { id: 'las-vegas', name: 'Las Vegas', events: 19, accent: '#c026d3', iconKey: 'ferrisWheel' },
    ],
  },
  {
    id: 'south-america',
    label: 'South America',
    cities: [
      { id: 'sao-paulo', name: 'São Paulo', events: 36, accent: '#16a34a', iconKey: 'building2' },
      { id: 'buenos-aires', name: 'Buenos Aires', events: 21, accent: '#2563eb', iconKey: 'landmark' },
      { id: 'bogota', name: 'Bogotá', events: 15, accent: '#ca8a04', iconKey: 'church' },
      { id: 'lima', name: 'Lima', events: 12, accent: '#dc2626', iconKey: 'castle' },
      { id: 'santiago', name: 'Santiago', events: 11, accent: '#ea580c', iconKey: 'mountain' },
      { id: 'rio-de-janeiro', name: 'Rio de Janeiro', events: 24, accent: '#059669', iconKey: 'treePalm' },
      { id: 'cartagena', name: 'Cartagena', events: 6, accent: '#7c3aed', iconKey: 'ferrisWheel' },
      { id: 'medellin', name: 'Medellín', events: 9, accent: '#db2777', iconKey: 'building2' },
    ],
  },
]

/** Flatten all cities in UI order (regions → cities). */
export function getAllLocationCities(): LocationCity[] {
  return LOCATION_REGIONS.flatMap((r) => r.cities)
}

/**
 * Shortlist regions/cities for typeahead menus: matches city name or whole region
 * (e.g. "asia" shows all cities under Asia & Pacific).
 */
export function filterLocationRegionsByQuery(query: string): LocationRegion[] {
  const q = query.trim().toLowerCase()
  if (!q) return LOCATION_REGIONS
  return LOCATION_REGIONS.map((region) => {
    if (region.label.toLowerCase().includes(q)) {
      return region
    }
    const cities = region.cities.filter((c) => c.name.toLowerCase().includes(q))
    return { ...region, cities }
  }).filter((r) => r.cities.length > 0)
}

export function getLocationCityById(id: string): LocationCity | undefined {
  return getAllLocationCities().find((c) => c.id === id)
}

/** Default Feed / app location (must exist in `LOCATION_REGIONS`). */
export const DEFAULT_LOCATION_CITY_ID = 'singapore'

export function getDefaultLocationCity(): LocationCity {
  const preferred = getLocationCityById(DEFAULT_LOCATION_CITY_ID)
  if (preferred) return preferred
  const first = LOCATION_REGIONS[0]?.cities[0]
  if (first) return first
  throw new Error('LOCATION_REGIONS has no cities')
}
