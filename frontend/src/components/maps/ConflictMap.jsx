import { useEffect, useState } from 'react'
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
      <div className="w-full h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={2}
      onLoad={setMap}
      options={{
        styles: [
          {
            featureType: 'poi',
            stylers: [{ visibility: 'off' }]
          }
        ]
      }}
    >
      {events.map((event, index) => (
        <div key={event._id || index}>
          <Marker
            position={{ lat: event.lat, lng: event.lng }}
            onClick={() => onEventClick && onEventClick(event)}
            icon={{
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: riskColors[event.summary?.riskLevel] || riskColors.medium,
              fillOpacity: 1,
              strokeColor: '#ffffff',
              strokeWeight: 2
            }}
          />
          
          <Polygon
            paths={getRegionBounds(event.lat, event.lng, event.country)}
            options={{
              fillColor: riskColors[event.summary?.riskLevel] || riskColors.medium,
              fillOpacity: 0.2,
              strokeColor: riskColors[event.summary?.riskLevel] || riskColors.medium,
              strokeOpacity: 0.6,
              strokeWeight: 2
            }}
            onClick={() => onEventClick && onEventClick(event)}
          />
        </div>
      ))}
    </GoogleMap>
  )
}
