import { Fragment, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search } from 'lucide-react'
import { filterLocationRegionsByQuery } from '../../../data/locationRegions'
import { useAppState } from '../../../store/appStore'

export function LocationCityPickerScreen() {
  const { closeLocationCityPicker, feedLocationCityId, locationSettingsDraft, updateLocationSettingsDraft } =
    useAppState()
  const [query, setQuery] = useState('')

  const selectedCityId = locationSettingsDraft?.cityId ?? feedLocationCityId

  const filteredRegions = useMemo(() => filterLocationRegionsByQuery(query), [query])

  return (
    <motion.div
      className="location-city-picker-screen"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      <header className="location-city-picker-screen-header">
        <button
          type="button"
          className="location-city-picker-screen-back"
          onClick={closeLocationCityPicker}
          aria-label="Back to location settings"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="location-city-picker-screen-title">Select current city</span>
        <span className="location-city-picker-screen-spacer" aria-hidden />
      </header>

      <div className="location-city-picker-search-wrap" role="presentation">
        <Search size={16} className="location-city-picker-search-icon" aria-hidden />
        <input
          type="search"
          className="location-city-picker-search-input"
          placeholder="Search cities or regions"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search cities and regions"
          autoComplete="off"
        />
      </div>

      <div className="location-city-picker-body">
        {filteredRegions.length === 0 ? (
          <p className="location-city-picker-empty">No cities match</p>
        ) : (
          filteredRegions.map((region) => (
            <section
              key={region.id}
              className="location-city-picker-region"
              aria-labelledby={`location-city-region-${region.id}`}
            >
              <h3 id={`location-city-region-${region.id}`} className="location-city-picker-region-title">
                {region.label}
              </h3>
              <ul className="location-city-picker-list">
                {region.cities.map((city) => (
                  <Fragment key={city.id}>
                    <li>
                      <button
                        type="button"
                        className={
                          city.id === selectedCityId
                            ? 'location-city-picker-item is-active'
                            : 'location-city-picker-item'
                        }
                        onClick={() => {
                          updateLocationSettingsDraft({ cityId: city.id })
                          closeLocationCityPicker()
                        }}
                      >
                        <span>{city.name}</span>
                        <span className="location-city-picker-item-meta">{city.events} gigs</span>
                      </button>
                    </li>
                  </Fragment>
                ))}
              </ul>
            </section>
          ))
        )}
      </div>
    </motion.div>
  )
}
