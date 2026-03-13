import { useEffect, useMemo, useState } from 'react'
import { GoogleMap, useJsApiLoader, Marker, Polygon } from '@react-google-maps/api'

const mapContainerStyle = {
  width: '100%',
  height: '600px'
}

const center = {
  lat: 30,
  lng: 20
}

const riskColors = {
  critical: '#dc2626',
  high: '#f97316',
  medium: '#eab308',
  low: '#22c55e'
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0b1023' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1023' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#cbd8ff' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#a5b4ff' }] },
  { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#1e2670' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#141c35' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#222b4f' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#050c2b' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#7c8bff' }] }
]

const getRegionBounds = (lat, lng, country) => {
  const regionSizes = {
    'Ukraine': 5,
    'Russia': 15,
    'Iran': 8,
    'Israel': 2,
    'Palestine': 1.5,
    'China': 12,
    'Taiwan': 2,
    'Syria': 3,
    'Yemen': 4,
    'Iraq': 4,
    'Saudi Arabia': 10,
    'UAE': 3,
    'India': 10,
    'Pakistan': 5,
    'Afghanistan': 5,
    'North Korea': 3,
    'South Korea': 2,
    'Japan': 5,
    'Unknown': 3
  }

  const size = regionSizes[country] || 3
  
  return [
    { lat: lat + size, lng: lng - size },
    { lat: lat + size, lng: lng + size },
    { lat: lat - size, lng: lng + size },
    { lat: lat - size, lng: lng - size }
  ]
}

export default function ConflictMap({ events = [], onEventClick }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  })

  const [map, setMap] = useState(null)

  const mapOptions = useMemo(() => {
    const baseOptions = {
      styles: darkMapStyle,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: true,
      mapTypeControl: true,
      mapTypeId: 'roadmap',
      backgroundColor: '#0b1023'
    }

    if (typeof window !== 'undefined' && window.google) {
      return {
        ...baseOptions,
        mapTypeControlOptions: {
          style: window.google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
          position: window.google.maps.ControlPosition.TOP_RIGHT
        },
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM
        },
        fullscreenControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP
        }
      }
    }

    return baseOptions
  }, [isLoaded])

  useEffect(() => {
    if (map && events.length > 0) {
      const bounds = new window.google.maps.LatLngBounds()
      events.forEach(event => {
        if (event.lat && event.lng) {
          bounds.extend({ lat: event.lat, lng: event.lng })
        }
      })
      map.fitBounds(bounds)
    }
  }, [map, events])

  if (!isLoaded) {
    return (
      <div className="w-full h-[600px] bg-black/40 rounded-xl border border-white/5 flex items-center justify-center">
        <div className="text-gray-400 font-medium tracking-wide">Initializing Global Map...</div>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={2}
      onLoad={setMap}
      options={mapOptions}
    >
      {events.map((event, index) => (
        <div key={event._id || index}>
          <Marker
            position={{ lat: event.lat, lng: event.lng }}
            onClick={() => onEventClick && onEventClick(event)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 9,
              fillColor: riskColors[event.summary?.riskLevel] || riskColors.medium,
              fillOpacity: 0.95,
              strokeColor: '#0b1023',
              strokeWeight: 3
            }}
          />

          <Polygon
            paths={getRegionBounds(event.lat, event.lng, event.country)}
            options={{
              fillColor: riskColors[event.summary?.riskLevel] || riskColors.medium,
              fillOpacity: 0.14,
              strokeColor: riskColors[event.summary?.riskLevel] || riskColors.medium,
              strokeOpacity: 0.8,
              strokeWeight: 2
            }}
            onClick={() => onEventClick && onEventClick(event)}
          />
        </div>
      ))}
    </GoogleMap>
  )
}
