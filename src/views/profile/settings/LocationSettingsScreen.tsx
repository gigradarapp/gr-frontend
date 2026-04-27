import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Crosshair, MapPin, Navigation } from 'lucide-react'
import { UploadToast, type UploadToastState } from '../../../components/UploadToast'
import { getLocationCityById } from '../../../data/locationRegions'
import { postProfileDefaultCity } from '../../../lib/auth-api'
import { useAppState } from '../../../store/appStore'

export function LocationSettingsScreen() {
  const {
    closeLocationSettings,
    commitLocationSettingsDraft,
    openLocationCityPicker,
    feedLocationCityId,
    locationPreferenceMode,
    nearbyRadiusKm,
    locationSettingsDraft,
    updateLocationSettingsDraft,
    setLocationPermission,
    isAuthenticated,
  } = useAppState()
  const [saveToast, setSaveToast] = useState<UploadToastState>(null)
  const [isSaving, setIsSaving] = useState(false)
  const toastIdRef = useRef(0)
  const closeTimerRef = useRef<number | null>(null)

  const dismissSaveToast = useCallback(() => setSaveToast(null), [])
  const pushSaveToast = useCallback((message: string, variant: 'success' | 'error') => {
    toastIdRef.current += 1
    setSaveToast({ id: toastIdRef.current, variant, message })
  }, [])

  useEffect(
    () => () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current)
      }
    },
    [],
  )

  const draft =
    locationSettingsDraft ?? {
      cityId: feedLocationCityId,
      mode: locationPreferenceMode,
      radiusKm: nearbyRadiusKm,
    }

  const cityName = getLocationCityById(draft.cityId)?.name ?? 'Not set'

  const handleSave = async () => {
    if (isSaving) return
    setIsSaving(true)
    const cityIdToPersist = draft.cityId

    if (isAuthenticated) {
      try {
        await postProfileDefaultCity(cityIdToPersist)
      } catch (e) {
        pushSaveToast(
          e instanceof Error ? e.message : 'Could not save location. Please try again.',
          'error',
        )
        if (import.meta.env.DEV) {
          console.warn('[gigradar] Could not persist default_city_id to profile', e)
        }
        setIsSaving(false)
        return
      }
    }

    pushSaveToast('Location settings saved.', 'success')
    closeTimerRef.current = window.setTimeout(() => {
      commitLocationSettingsDraft()
    }, 700)
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
          disabled={isSaving}
          aria-busy={isSaving}
        >
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </header>

      <div className="location-settings-body">
        <section className="location-settings-section">
          <h3 className="location-settings-section-title">Current city</h3>
          <div
            className="location-settings-mode-grid"
            role="radiogroup"
            aria-label="How to set your city"
          >
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
              <span>Auto-detect</span>
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
              <span>Manual select</span>
            </button>
          </div>
          {draft.mode === 'city' ? (
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
          ) : null}
        </section>

        <section className="location-settings-section">
          <p className="location-settings-note">
            PDPA Note: We do not capture or store your GPS history. We only save your default city
            selection (city/country) to best curate your Buzo experience.
          </p>
        </section>
      </div>

      <UploadToast toast={saveToast} onDismiss={dismissSaveToast} />
    </motion.div>
  )
}
