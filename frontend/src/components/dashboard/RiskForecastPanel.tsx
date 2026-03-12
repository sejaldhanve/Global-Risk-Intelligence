"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { time: "Jan", risk: 40 },
  { time: "Feb", risk: 30 },
  { time: "Mar", risk: 60 },
  { time: "Apr", risk: 45 },
  { time: "May", risk: 78 },
  { time: "Jun", risk: 65 },
  { time: "Jul", risk: 85 },
];

export function RiskForecastPanel({ delay = 0 }: { delay?: number }) {
  return (
    <GlassPanel delay={delay} className="col-span-1 md:col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100">Systemic Risk Forecast</h3>
        <span className="px-2 py-1 text-xs font-bold bg-[#ff2a2a]/20 text-[#ff2a2a] rounded animate-pulse">
          HIGH ALERT
        </span>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5722" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#ff5722" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)", color: "var(--foreground)", borderRadius: "8px" }}
              itemStyle={{ color: "#ff5722" }}
            />
            <Area type="monotone" dataKey="risk" stroke="#ff5722" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
