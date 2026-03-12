"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search } from "lucide-react";

// Fix for default marker icons in Leaflet with Next.js
const createDefaultIcon = () => {
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

// Custom red icon for conflict markers
const createRedIcon = () => {
  return L.divIcon({
    className: 'custom-div-icon bg-transparent border-none',
    html: `<div style="background-color: #E96013; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; position: relative;"><svg style="position: absolute;" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Ukraine Center
const mapCenter: [number, number] = [49.0, 31.0];

// Component to update map view dynamically
function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function MapComponent() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(mapCenter);
  const [currentZoom, setCurrentZoom] = useState(6);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
      const data = await res.json();
      
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCurrentCenter([parseFloat(lat), parseFloat(lon)]);
        setCurrentZoom(8);
      } else {
        alert("Location not found. Please try a different search term.");
      }
    } catch (err) {
      console.error("Search failed:", err);
      alert("Search failed. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  if (!mounted) return null;

  const redIcon = createRedIcon();
  const defaultIcon = createDefaultIcon();

  return (
    <div className="w-full h-full flex flex-col relative text-black">
      
      {/* Top Search Bar Overlay */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-xl">
        <form onSubmit={handleSearch} className="relative shadow-xl">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isSearching ? 'text-[#E96013] animate-pulse' : 'text-gray-500'}`} />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isSearching}
            placeholder="Search regions, cities, or specific risk events..." 
            className="w-full bg-white border border-gray-200 rounded-full py-3 pl-12 pr-4 text-[15px] font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E96013] transition-shadow shadow-md disabled:opacity-70"
          />
        </form>
      </div>

      <style>{`
        .leaflet-bottom.leaflet-right {
          margin-bottom: 100px !important;
          margin-right: 20px !important;
        }
      `}</style>

      <MapContainer 
        center={mapCenter} 
        zoom={6} 
        zoomControl={false}
        className="w-full h-full flex-1 z-0 absolute inset-0"
      >
        <ChangeView center={currentCenter} zoom={currentZoom} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Force bottom right zoom control location */}
        <ZoomControl position="bottomright" />

        {/* Example Conflict Markers (Eastern Ukraine) */}
        <Marker position={[48.0, 37.8]} icon={redIcon}>
          <Popup>Heavy artillery activity reported.</Popup>
        </Marker>
        <Marker position={[48.5, 38.0]} icon={redIcon}>
          <Popup>Convoy movement detected.</Popup>
        </Marker>
        <Marker position={[49.0, 38.2]} icon={redIcon}>
          <Popup>Air raid sirens active.</Popup>
        </Marker>
        <Marker position={[48.2, 37.5]} icon={redIcon}>
          <Popup>Infrastructure damage confirmed.</Popup>
        </Marker>
        <Marker position={[47.8, 37.0]} icon={redIcon}>
          <Popup>Troop repositioning.</Popup>
        </Marker>
        
        {/* Example Capital Marker */}
        <Marker position={[50.4501, 30.5234]} icon={defaultIcon}>
          <Popup>
            <strong>Kyiv</strong><br/>
            Capital Status: Secure
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Legend Overlay */}
      <div className="absolute bottom-6 left-6 z-[1000] bg-white rounded-lg p-4 shadow-lg border border-gray-200">
        <h4 className="font-bold text-gray-800 text-sm mb-3">Risk Legend</h4>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#E96013] border-2 border-white shadow-sm flex items-center justify-center"></div>
            <span className="text-xs text-gray-600 font-medium">Active Conflict / Event</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border-2 border-blue-500 bg-blue-100/50 shadow-sm flex items-center justify-center"></div>
            <span className="text-xs text-gray-600 font-medium">Monitored Location</span>
          </div>
        </div>
      </div>
    </div>
  );
}
