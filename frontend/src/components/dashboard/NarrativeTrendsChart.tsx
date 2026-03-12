"use client";

import { GlassPanel } from "@/components/ui/GlassPanel";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { topic: "Trade War", volume: 4000 },
  { topic: "Cyber Attack", volume: 3000 },
  { topic: "Supply Chain", volume: 2000 },
  { topic: "Energy Crisis", volume: 2780 },
  { topic: "Sanctions", volume: 1890 },
];

export function NarrativeTrendsChart({ delay = 0 }: { delay?: number }) {
  return (
    <GlassPanel delay={delay} className="bg-[#050510]/50 border-white/10 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <h3 className="text-lg font-semibold tracking-wide text-white mb-4">Narrative Trends</h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="topic" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={90} />
            <Tooltip
              cursor={{ fill: "rgba(252,163,17,0.05)" }}
              contentStyle={{ backgroundColor: "#050510", borderColor: "rgba(255,255,255,0.1)", color: "#ffffff", borderRadius: "8px" }}
              itemStyle={{ color: "#ffd166" }}
            />
            <Bar dataKey="volume" fill="#ffd166" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
