"use client";

import dynamic from "next/dynamic";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { Activity } from "lucide-react";

// Disable SSR for react-leaflet components since they depend on the window object
const ConflictHeatmapDynamic = dynamic(() => import("./ConflictHeatmapDynamic"), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center text-gray-500">Initializing Tracking Array...</div> });

export function ConflictHeatmap({ delay = 0 }: { delay?: number }) {
  return (
    <GlassPanel delay={delay} className="col-span-1 md:col-span-2 lg:col-span-3 min-h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#ff2a2a]" />
          <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100">Global Conflict Heatmap</h3>
        </div>
        <span className="text-xs text-white bg-[#ff2a2a]/40 border border-[#ff2a2a] px-2 py-1 rounded shadow-[0_0_8px_rgba(255,42,42,0.4)]">LIVE SYS-NET</span>
      </div>
      <div className="flex-1 w-full relative min-h-[300px] h-[350px]">
        <ConflictHeatmapDynamic />
      </div>
    </GlassPanel>
  );
}
