import { useMemo } from 'react'
import { filterLocationRegionsByQuery, formatLocationRegionHeading } from '../data/locationRegions'

export type CityCatalogPanelProps = {
  searchQuery: string
  onSearchQueryChange: (q: string) => void
  selectedCityIds: string[]
  onCityClick: (cityId: string) => void
  /** When true, listbox is announced as multi-select (onboarding). */
  multiselect?: boolean
  listboxId: string
  listboxLabel?: string
}

export function CityCatalogPanel({
  searchQuery,
  onSearchQueryChange,
  selectedCityIds,
  onCityClick,
  multiselect = false,
  listboxId,
  listboxLabel = 'Cities by region',
}: CityCatalogPanelProps) {
  const filteredLocationRegions = useMemo(
    () => filterLocationRegionsByQuery(searchQuery),
    [searchQuery],
  )

  return (
    <div className="onboarding-lcp">
      <div className="lcp-search-wrap onboarding-lcp-search-wrap">
        <input
          type="search"
          className="feed-filter-menu-search lcp-search onboarding-lcp-search-input"
          placeholder="Search cities or regions…"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          aria-label="Search cities and regions"
          autoComplete="off"
          onKeyDown={(e) => e.stopPropagation()}
        />
      </div>
      <div
        className="onboarding-lcp-scroll"
        id={listboxId}
        role="listbox"
        aria-label={listboxLabel}
        aria-multiselectable={multiselect}
      >
        {filteredLocationRegions.length === 0 ? (
          <p className="lcp-empty onboarding-lcp-empty">No cities match</p>
        ) : (
          filteredLocationRegions.map((region) => (
            <section key={region.id} className="lcp-region onboarding-lcp-region">
              <h3 className="lcp-region-heading onboarding-lcp-region-heading">
                {formatLocationRegionHeading(region.label)}
              </h3>
              <ul className="lcp-chip-row onboarding-lcp-chip-row">
                {region.cities.map((city) => (
                  <li key={city.id} role="presentation">
                    <button
                      type="button"
                      className={`feed-location-curtain__chip onboarding-lcp-chip${
                        selectedCityIds.includes(city.id) ? ' is-active' : ''
                      }`}
                      role="option"
                      aria-selected={selectedCityIds.includes(city.id)}
                      onClick={() => onCityClick(city.id)}
                    >
                      {city.name}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </div>
  )
}
