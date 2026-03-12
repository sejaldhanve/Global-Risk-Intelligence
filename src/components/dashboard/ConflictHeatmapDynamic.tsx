"use client";

import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const markers = [
  { id: 1, pos: [48.8566, 2.3522], risk: "high", desc: "Logistics Hub Disruption" },
  { id: 2, pos: [25.2048, 55.2708], risk: "critical", desc: "Naval Blockade" },
  { id: 3, pos: [35.6762, 139.6503], risk: "medium", desc: "Supply Chain Delay" },
  { id: 4, pos: [50.4501, 30.5234], risk: "critical", desc: "Active Conflict Zone" },
  { id: 5, pos: [14.5995, 120.9842], risk: "high", desc: "Maritime Dispute" },
  { id: 6, pos: [38.9072, -77.0369], risk: "medium", desc: "Policy Shift Impact" },
  { id: 7, pos: [3.1390, 101.6869], risk: "high", desc: "Port Congestion" }
];

export default function ConflictHeatmapDynamic() {
  return (
    <div className="w-full h-full rounded-md overflow-hidden relative z-0 border border-[var(--panel-border)] shadow-inner">
      <MapContainer center={[30, 0]} zoom={2} style={{ height: "100%", width: "100%", background: "#0a0a0a" }} zoomControl={false} scrollWheelZoom={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; OpenStreetMap'
        />
        {markers.map((m) => (
          <CircleMarker
            key={m.id}
            center={m.pos as [number, number]}
            radius={m.risk === "critical" ? 10 : m.risk === "high" ? 7 : 5}
            pathOptions={{
              color: m.risk === "critical" ? "#ff2a2a" : m.risk === "high" ? "#ff5722" : "#b026ff",
              fillColor: m.risk === "critical" ? "#ff2a2a" : m.risk === "high" ? "#ff5722" : "#b026ff",
              fillOpacity: 0.6,
              className: "animate-pulse"
            }}
          >
            <Popup className="custom-popup">
              <div className="text-gray-900 font-semibold text-sm">{m.desc}</div>
              <div className="text-xs text-gray-500 uppercase mt-1">Severity: {m.risk}</div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
