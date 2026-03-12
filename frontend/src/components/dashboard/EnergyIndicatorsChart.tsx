"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { time: "00:00", oil: 82.5, gas: 2.8 },
  { time: "04:00", oil: 83.1, gas: 2.9 },
  { time: "08:00", oil: 82.9, gas: 3.1 },
  { time: "12:00", oil: 84.5, gas: 3.2 },
  { time: "16:00", oil: 85.2, gas: 3.4 },
  { time: "20:00", oil: 86.8, gas: 3.5 },
];

export function EnergyIndicatorsChart({ delay = 0 }: { delay?: number }) {
  return (
    <GlassPanel delay={delay}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100">Global Energy Prices</h3>
        <span className="text-xs text-[#00f0ff]">Live Feed</span>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)", color: "var(--foreground)", borderRadius: "8px" }}
            />
            <Line type="monotone" dataKey="oil" stroke="#00f0ff" strokeWidth={2} dot={{ r: 4, fill: "#00f0ff" }} activeDot={{ r: 6 }} name="Crude Oil (Brent)" />
            <Line type="monotone" dataKey="gas" stroke="#b026ff" strokeWidth={2} dot={{ r: 4, fill: "#b026ff" }} activeDot={{ r: 6 }} name="Natural Gas" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
