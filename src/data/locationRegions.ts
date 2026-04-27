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

/**
 * Approximate city centers (WGS84) for auto-detect → nearest catalog city and map preview.
 * Every city id in `LOCATION_REGIONS` should have an entry.
 */
export const LOCATION_CITY_CENTROIDS: Record<string, [number, number]> = {
  singapore: [1.3521, 103.8198],
  bangkok: [13.7563, 100.5018],
  seoul: [37.5665, 126.978],
  sydney: [-33.8688, 151.2093],
  dubai: [25.2048, 55.2708],
  tokyo: [35.6762, 139.6503],
  'hong-kong': [22.3193, 114.1694],
  mumbai: [19.076, 72.8777],
  jakarta: [-6.2088, 106.8456],
  manila: [14.5995, 120.9842],
  'kuala-lumpur': [3.139, 101.6869],
  auckland: [-36.8485, 174.7633],
  melbourne: [-37.8136, 144.9631],
  taipei: [25.033, 121.5654],
  bali: [-8.4095, 115.1889],
  osaka: [34.6937, 135.5023],
  hanoi: [21.0285, 105.8542],
  phuket: [7.8804, 98.3923],
  chennai: [13.0827, 80.2707],
  'ho-chi-minh': [10.8231, 106.6297],
  lagos: [6.5244, 3.3792],
  cairo: [30.0444, 31.2357],
  'cape-town': [-33.9249, 18.4241],
  nairobi: [-1.2921, 36.8219],
  marrakech: [31.6295, -7.9811],
  accra: [5.6037, -0.187],
  johannesburg: [-26.2041, 28.0473],
  tunis: [36.8065, 10.1815],
  london: [51.5074, -0.1278],
  berlin: [52.52, 13.405],
  paris: [48.8566, 2.3522],
  amsterdam: [52.3676, 4.9041],
  barcelona: [41.3851, 2.1734],
  vienna: [48.2082, 16.3738],
  prague: [50.0755, 14.4378],
  lisbon: [38.7223, -9.1393],
  milan: [45.4642, 9.19],
  dublin: [53.3498, -6.2603],
  'new-york': [40.7128, -74.006],
  'los-angeles': [34.0522, -118.2437],
  toronto: [43.6532, -79.3832],
  'mexico-city': [19.4326, -99.1332],
  miami: [25.7617, -80.1918],
  chicago: [41.8781, -87.6298],
  vancouver: [49.2827, -123.1207],
  'las-vegas': [36.1699, -115.1398],
  'sao-paulo': [-23.5505, -46.6333],
  'buenos-aires': [-34.6037, -58.3816],
  bogota: [4.711, -74.0721],
  lima: [-12.0464, -77.0428],
  santiago: [-33.4489, -70.6693],
  'rio-de-janeiro': [-22.9068, -43.1729],
  cartagena: [10.391, -75.4794],
  medellin: [6.2476, -75.5658],
}

/** Flatten all cities in UI order (regions → cities). */
export function getAllLocationCities(): LocationCity[] {
  return LOCATION_REGIONS.flatMap((r) => r.cities)
}

/** Region title in city pickers (matches Discover location sheet). */
export function formatLocationRegionHeading(label: string): string {
  return label.replace(/\s*&\s*/g, ' ').trim()
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

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

/** Nearest catalog city to coordinates (for auto-detect UI). */
export function findNearestLocationCityId(lat: number, lng: number): string {
  let bestId = DEFAULT_LOCATION_CITY_ID
  let bestKm = Infinity
  for (const city of getAllLocationCities()) {
    const c = LOCATION_CITY_CENTROIDS[city.id]
    if (!c) continue
    const d = haversineKm(lat, lng, c[0], c[1])
    if (d < bestKm) {
      bestKm = d
      bestId = city.id
    }
  }
  return bestId
}

export function distanceKmToLocationCity(lat: number, lng: number, cityId: string): number | null {
  const c = LOCATION_CITY_CENTROIDS[cityId]
  if (!c) return null
  return haversineKm(lat, lng, c[0], c[1])
}

export function getLocationCityCentroid(cityId: string): [number, number] | null {
  const c = LOCATION_CITY_CENTROIDS[cityId]
  return c ?? null
}

/** `LOCATION_REGIONS` order — regions, then cities within each region. */
export function sortCityIdsByCatalogOrder(ids: string[]): string[] {
  const rank = new Map(getAllLocationCities().map((c, i) => [c.id, i]))
  return [...new Set(ids)].sort((a, b) => (rank.get(a) ?? 99999) - (rank.get(b) ?? 99999))
}

/** Primary feed city: first selected city in catalog order (rest are extra interests). */
export function primaryCityIdFromSelection(ids: string[]): string {
  const sorted = sortCityIdsByCatalogOrder(ids)
  return sorted[0] ?? DEFAULT_LOCATION_CITY_ID
}

export function getDefaultLocationCity(): LocationCity {
  const preferred = getLocationCityById(DEFAULT_LOCATION_CITY_ID)
  if (preferred) return preferred
  const first = LOCATION_REGIONS[0]?.cities[0]
  if (first) return first
  throw new Error('LOCATION_REGIONS has no cities')
}
