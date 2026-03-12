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
    <GlassPanel delay={delay} className="col-span-1 md:col-span-2 bg-[#050510]/50 border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center mb-4 px-1">
        <h3 className="text-lg font-semibold tracking-wide text-white">Systemic Risk Forecast</h3>
        <span className="px-2 py-1 text-xs font-bold bg-[#fca311]/10 text-[#fca311] border border-[#fca311]/20 rounded shadow-[0_0_8px_rgba(252,163,17,0.2)] animate-pulse">
          HIGH ALERT
        </span>
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fca311" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#fca311" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "#050510", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff", borderRadius: "8px" }}
              itemStyle={{ color: "#fca311" }}
            />
            <Area type="monotone" dataKey="risk" stroke="#fca311" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
