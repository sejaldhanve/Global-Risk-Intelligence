"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Ship } from "lucide-react";

const chokepoints = [
  { name: "Strait of Hormuz", status: "Critical delay", traffic: "High" },
  { name: "Suez Canal", status: "Operational", traffic: "Normal" },
  { name: "Panama Canal", status: "Restricted", traffic: "Low" },
  { name: "Malacca Strait", status: "Congested", traffic: "High" },
];

export function ShippingRoutesMap({ delay = 0 }: { delay?: number }) {
  return (
    <GlassPanel delay={delay} className="flex flex-col bg-[#050510]/50 border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center mb-4 px-1">
        <div className="flex items-center gap-2">
          <Ship className="w-5 h-5 text-[#fca311]" />
          <h3 className="text-lg font-semibold tracking-wide text-white">Maritime Chokepoints</h3>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {chokepoints.map((cp, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <div>
              <div className="text-sm font-medium text-gray-200">{cp.name}</div>
              <div className="text-xs text-gray-400">Traffic: {cp.traffic}</div>
            </div>
            <div className={`text-xs px-2 py-1 rounded font-semibold ${cp.status === "Critical delay" ? "text-red-400 bg-red-400/10 border border-red-400/20" : cp.status === "Restricted" ? "text-[#fca311] bg-[#fca311]/10 border border-[#fca311]/20" : cp.status === "Congested" ? "text-[#ffd166] bg-[#ffd166]/10 border border-[#ffd166]/20" : "text-green-400 bg-green-400/10 border border-green-400/20"}`}>
              {cp.status}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
