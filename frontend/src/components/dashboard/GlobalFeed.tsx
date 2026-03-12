"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

const feedData = [
  { id: 1, type: "critical", message: "Naval blockade detected in Strait of Hormuz", time: "2 min ago" },
  { id: 2, type: "warning", message: "Cyberattack on logistics infrastructure in Europe", time: "15 min ago" },
  { id: 3, type: "info", message: "New trade tariffs announced for semiconductor exports", time: "1 hr ago" },
  { id: 4, type: "warning", message: "Unusual troop movements near border regions", time: "3 hrs ago" },
  { id: 5, type: "critical", message: "Major energy pipeline pressure drop reported", time: "5 hrs ago" },
];

export function GlobalFeed({ delay = 0 }: { delay?: number }) {
  return (
    <GlassPanel delay={delay} className="col-span-1 row-span-2">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100">Intelligence Feed</h3>
        <div className="w-2 h-2 rounded-full bg-[#ff2a2a] animate-ping"></div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
        {feedData.map((item) => (
          <div key={item.id} className="flex gap-3 items-start border-l-2 pl-3 py-1 transition-all hover:bg-black/5 dark:hover:bg-white/5 rounded-r"
            style={{
              borderColor: item.type === "critical" ? "var(--color-alert-red)" : item.type === "warning" ? "var(--color-alert-orange)" : "var(--color-cyber-blue)"
            }}
          >
            <div className="mt-0.5">
              {item.type === "critical" && <AlertCircle className="w-4 h-4 text-[#ff2a2a]" />}
              {item.type === "warning" && <AlertTriangle className="w-4 h-4 text-[#ff5722]" />}
              {item.type === "info" && <Info className="w-4 h-4 text-[#00f0ff]" />}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">{item.message}</p>
              <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block">{item.time}</span>
            </div>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
