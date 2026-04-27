import { useEffect } from 'react'
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Theme } from '../types'

function FitBoundsTwo({
  user,
  city,
}: {
  user: [number, number]
  city: [number, number]
}) {
  const map = useMap()
  useEffect(() => {
    const b = L.latLngBounds([user, city])
    map.fitBounds(b, { padding: [32, 32], maxZoom: 11, animate: false })
  }, [map, user, city])
  return null
}

export type OnboardingGeoPreviewMapProps = {
  userLatLng: [number, number]
  cityLatLng: [number, number]
  theme: Theme
}

export function OnboardingGeoPreviewMap({
  userLatLng,
  cityLatLng,
  theme,
}: OnboardingGeoPreviewMapProps) {
  const tileUrl =
    theme === 'light'
      ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  const mid: [number, number] = [
    (userLatLng[0] + cityLatLng[0]) / 2,
    (userLatLng[1] + cityLatLng[1]) / 2,
  ]

  return (
    <MapContainer
      center={mid}
      zoom={10}
      zoomControl={false}
      attributionControl={false}
      className="onboarding-geo-map"
      scrollWheelZoom={false}
      dragging={false}
      doubleClickZoom={false}
      touchZoom={false}
      boxZoom={false}
      keyboard={false}
    >
      <TileLayer url={tileUrl} subdomains={['a', 'b', 'c', 'd']} maxZoom={20} />
      <FitBoundsTwo user={userLatLng} city={cityLatLng} />
      <CircleMarker
        center={userLatLng}
        radius={8}
        pathOptions={{
          color: '#1d4ed8',
          fillColor: '#3b82f6',
          fillOpacity: 0.92,
          weight: 2,
        }}
      />
      <CircleMarker
        center={cityLatLng}
        radius={8}
        pathOptions={{
          color: '#9f1a0a',
          fillColor: '#e24325',
          fillOpacity: 0.9,
          weight: 2,
        }}
      />
    </MapContainer>
  )
}
