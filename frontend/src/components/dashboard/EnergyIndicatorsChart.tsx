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
    <GlassPanel delay={delay} className="bg-[#050510]/50 border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-lg font-semibold tracking-wide text-white">Global Energy Prices</h3>
        <span className="text-xs text-[#fca311] animate-pulse">Live Feed</span>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#050510", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff", borderRadius: "8px" }}
            />
            <Line type="monotone" dataKey="oil" stroke="#fca311" strokeWidth={2} dot={{ r: 4, fill: "#fca311" }} activeDot={{ r: 6 }} name="Crude Oil (Brent)" />
            <Line type="monotone" dataKey="gas" stroke="#ffd166" strokeWidth={2} dot={{ r: 4, fill: "#ffd166" }} activeDot={{ r: 6 }} name="Natural Gas" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
