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
    <GlassPanel delay={delay} className="flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Ship className="w-5 h-5 text-[#00f0ff]" />
          <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100">Maritime Chokepoints</h3>
        </div>
      </div>
      <div className="flex-1 flex flex-col justify-center space-y-4">
        {chokepoints.map((cp, idx) => (
          <div key={idx} className="flex justify-between items-center p-3 rounded bg-black/5 dark:bg-white/5 border border-[var(--panel-border)]">
            <div>
              <div className="text-sm font-medium dark:text-gray-200 text-gray-800">{cp.name}</div>
              <div className="text-xs text-gray-500">Traffic: {cp.traffic}</div>
            </div>
            <div className={`text-xs px-2 py-1 rounded font-semibold ${cp.status === "Critical delay" ? "text-[#ff2a2a] bg-[#ff2a2a]/10" : cp.status === "Restricted" ? "text-[#ff5722] bg-[#ff5722]/10" : cp.status === "Congested" ? "text-yellow-500 bg-yellow-500/10" : "text-[#00f0ff] bg-[#00f0ff]/10"}`}>
              {cp.status}
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
