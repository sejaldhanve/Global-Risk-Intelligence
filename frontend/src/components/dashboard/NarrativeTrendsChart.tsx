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
    <GlassPanel delay={delay}>
      <h3 className="text-lg font-semibold tracking-wide text-gray-800 dark:text-gray-100 mb-4">Narrative Trends</h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis dataKey="topic" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={90} />
            <Tooltip
              cursor={{ fill: "rgba(255,255,255,0.05)" }}
              contentStyle={{ backgroundColor: "var(--panel-bg)", borderColor: "var(--panel-border)", color: "var(--foreground)", borderRadius: "8px" }}
            />
            <Bar dataKey="volume" fill="#00f0ff" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
