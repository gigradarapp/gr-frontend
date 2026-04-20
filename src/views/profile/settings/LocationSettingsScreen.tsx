import { motion } from 'framer-motion'
import { ArrowLeft, Crosshair, MapPin, Navigation } from 'lucide-react'
import { getLocationCityById } from '../../../data/locationRegions'
import { postProfileDefaultCity } from '../../../lib/auth-api'
import { useAppState } from '../../../store/appStore'

const RADIUS_OPTIONS_KM = [1, 3, 5, 8, 12, 25] as const

export function LocationSettingsScreen() {
  const {
    closeLocationSettings,
    commitLocationSettingsDraft,
    openLocationCityPicker,
    feedLocationCityId,
    locationPreferenceMode,
    nearbyRadiusKm,
    locationPermission,
    locationSettingsDraft,
    updateLocationSettingsDraft,
    setLocationPermission,
    isAuthenticated,
    profileDefaultCityId,
  } = useAppState()

  const draft =
    locationSettingsDraft ?? {
      cityId: feedLocationCityId,
      mode: locationPreferenceMode,
      radiusKm: nearbyRadiusKm,
    }

  const hasExplicitDefaultCity = !isAuthenticated || profileDefaultCityId != null
  const cityName = hasExplicitDefaultCity
    ? (getLocationCityById(draft.cityId)?.name ?? 'Singapore')
    : 'Not set'

  const handleSave = () => {
    const cityIdToPersist = draft.cityId
    commitLocationSettingsDraft()
    if (!isAuthenticated) return
    void postProfileDefaultCity(cityIdToPersist).catch((e) => {
      if (import.meta.env.DEV) {
        console.warn('[gigradar] Could not persist default_city_id to profile', e)
      }
    })
  }

  const requestPreciseLocation = () => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setLocationPermission('denied')
      window.alert('Location is not available on this browser. Using your default city instead.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      () => {
        setLocationPermission('granted')
        updateLocationSettingsDraft({ mode: 'precise' })
      },
      (err) => {
        if (err.code === 1) {
          setLocationPermission('denied')
          updateLocationSettingsDraft({ mode: 'city' })
          window.alert('Location permission denied. We will use your default city instead.')
          return
        }
        setLocationPermission('unknown')
        window.alert('Could not read your location now. We will keep default city mode active.')
      },
      { timeout: 10_000, enableHighAccuracy: false, maximumAge: 120_000 },
    )
  }

  return (
    <motion.div
      className="location-settings-screen"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 34 }}
    >
      <header className="location-settings-screen-header">
        <button
          type="button"
          className="location-settings-screen-back"
          onClick={closeLocationSettings}
          aria-label="Back to settings"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="location-settings-screen-title">Location & gigs near you</span>
        <button
          type="button"
          className="location-settings-screen-save"
          onClick={handleSave}
        >
          Save
        </button>
      </header>

      <div className="location-settings-body">
        <section className="location-settings-section">
          <h3 className="location-settings-section-title">Discovery scope</h3>
          <div className="location-settings-mode-grid" role="radiogroup" aria-label="Location mode">
            <button
              type="button"
              className={
                draft.mode === 'precise'
                  ? 'location-settings-mode-btn is-active'
                  : 'location-settings-mode-btn'
              }
              role="radio"
              aria-checked={draft.mode === 'precise'}
              onClick={requestPreciseLocation}
            >
              <Crosshair size={16} aria-hidden />
              <span>Precise location</span>
            </button>
            <button
              type="button"
              className={
                draft.mode === 'city'
                  ? 'location-settings-mode-btn is-active'
                  : 'location-settings-mode-btn'
              }
              role="radio"
              aria-checked={draft.mode === 'city'}
              onClick={() => updateLocationSettingsDraft({ mode: 'city' })}
            >
              <MapPin size={16} aria-hidden />
              <span>Default city</span>
            </button>
          </div>
          <p className="location-settings-note">
            If precise location is unavailable, Buzo uses your default city.
          </p>
        </section>

        <section className="location-settings-section">
          <h3 className="location-settings-section-title">Current city</h3>
          <div className="location-settings-card">
            <button
              type="button"
              className="location-settings-row"
              onClick={openLocationCityPicker}
              aria-label={`Choose city, currently ${cityName}`}
            >
              <span className="location-settings-row-icon" aria-hidden>
                <MapPin size={16} />
              </span>
              <span className="location-settings-row-label">Selected city</span>
              <span className="location-settings-row-value">{cityName}</span>
              <Navigation size={16} className="location-settings-row-chevron" aria-hidden />
            </button>
          </div>
        </section>

        <section className="location-settings-section">
          <h3 className="location-settings-section-title">Radius in {cityName}</h3>
          <div className="location-radius-grid" role="listbox" aria-label="Nearby radius">
            {RADIUS_OPTIONS_KM.map((radius) => (
              <button
                key={radius}
                type="button"
                className={
                  draft.radiusKm === radius
                    ? 'location-radius-chip is-active'
                    : 'location-radius-chip'
                }
                role="option"
                aria-selected={draft.radiusKm === radius}
                onClick={() => {
                  updateLocationSettingsDraft({ radiusKm: radius, mode: 'precise' })
                }}
              >
                {radius} km
              </button>
            ))}
          </div>
          <p className="location-settings-note">
            Permission: <strong>{locationPermission}</strong>
            {locationPermission !== 'granted' ? ' · default city mode remains available.' : ''}
          </p>
        </section>

        <section className="location-settings-section">
          <p className="location-settings-note">
            PDPA Note: We do not capture or store your GPS history. We only save your default city
            selection (city/country) to best curate your Buzo experience.
          </p>
        </section>
      </div>
    </motion.div>
  )
}
