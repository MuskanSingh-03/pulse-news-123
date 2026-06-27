"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

type Article = {
  source?: string;
  title?: string;
  url?: string;
};

type Cluster = {
  id: string | number;
  label: string;
  article_count?: number;
  articles?: Article[];
};

interface DashboardProps {
  clusters: Cluster[];
  onSelectCluster: (cluster: Cluster) => void;
}

export default function DashboardView({ clusters, onSelectCluster }: DashboardProps) {
  const totalArticles = clusters.reduce((acc, c) => acc + (c.article_count || 0), 0);

  // Chart data formatting
  const timelineData = clusters.map((c, index) => ({
    name: c.label && c.label.length > 12 ? c.label.substring(0, 12) + "..." : c.label || `Topic ${index + 1}`,
    "Articles Count": c.article_count || 0,
  }));

  return (
    <div className="space-y-10 animate-fade-in">
      
      {/* 1. STATS HERO ROW */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-pink-500/20 bg-black/40 p-7 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-300">Total Articles</p>
          <h2 className="mt-4 text-6xl font-black">{totalArticles}</h2>
        </div>
        <div className="rounded-3xl border border-cyan-500/20 bg-black/40 p-7 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-cyan-300">Active Clusters</p>
          <h2 className="mt-4 text-6xl font-black">{clusters.length}</h2>
        </div>
        <div className="rounded-3xl border border-purple-500/20 bg-black/40 p-7 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Top Story</p>
          <h2 className="mt-4 text-xl font-bold truncate">{clusters[0]?.label || "Syncing Data..."}</h2>
        </div>
      </section>

      {/* 2. ANALYTICS AREA CHART CONTAINER */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-7 backdrop-blur-xl">
        <h2 className="text-2xl font-black mb-6 text-pink-400 uppercase tracking-wider">Cluster Density Timeline</h2>
        <div className="h-[350px] w-full pr-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="dashGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff4ecd" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#ff4ecd" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#a1a1aa" tick={{ fontSize: 11 }} />
              <YAxis stroke="#a1a1aa" tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: '#090b17', borderColor: '#ff4ecd' }} />
              <Area type="monotone" dataKey="Articles Count" stroke="#ff4ecd" fill="url(#dashGlow)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 3. ORIGINAL TOPIC CLUSTERS GRID */}
      <div>
        <h2 className="text-2xl font-black mb-6 text-cyan-400 uppercase tracking-wider">Active Intelligence Clusters</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
          {clusters.map((cluster) => (
            <button
              key={cluster.id}
              onClick={async () => {
                try {
                  const res = await fetch(`http://localhost:5000/api/clusters/${cluster.id}`);
                  const articles = await res.json();
                  onSelectCluster({ ...cluster, articles });
                } catch (err) {
                  onSelectCluster(cluster);
                }
              }}
              className="group rounded-3xl border border-white/10 bg-black/40 p-7 text-left hover:border-pink-500/40 hover:bg-pink-500/[0.02] transition-all"
            >
              <p className="text-xs uppercase tracking-widest text-pink-300 mb-2">Live Topic Stream</p>
              <h3 className="text-xl font-bold line-clamp-2 mb-4 text-zinc-100 group-hover:text-pink-300">{cluster.label}</h3>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-500">Indexed Articles</span>
                <span className="bg-pink-500/20 text-pink-300 border border-pink-500/30 px-3 py-1 rounded-full text-xs font-bold">{cluster.article_count}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}