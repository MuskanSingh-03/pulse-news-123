"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Cluster = {
  label: string;
  article_count?: number;
};

interface TimelineProps {
  clusters: Cluster[];
}

export default function TimelineView({ clusters }: TimelineProps) {
  const data = clusters.map((c, index) => ({
    name: c.label && c.label.length > 15 ? c.label.substring(0, 15) + "..." : c.label || `Topic ${index + 1}`,
    "Articles Count": c.article_count || 0,
  }));

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-7 backdrop-blur-xl animate-fade-in">
      <h2 className="text-3xl font-black mb-6 text-pink-400">Cluster Density Timeline</h2>
      <div className="h-[420px] w-full pr-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="viewGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff4ecd" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#ff4ecd" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 11 }} />
            <YAxis stroke="#a1a1aa" tick={{ fill: '#a1a1aa', fontSize: 12 }} />
            <Tooltip contentStyle={{ backgroundColor: '#090b17', borderColor: '#ff4ecd' }} />
            <Area type="monotone" dataKey="Articles Count" stroke="#ff4ecd" fill="url(#viewGlow)" strokeWidth={3} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}