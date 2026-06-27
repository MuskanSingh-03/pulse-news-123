"use client";

import { useState, useEffect } from "react";

type Cluster = {
  id?: string | number;
  label: string;
  article_count?: number;
};

interface BreakingProps {
  clusters: Cluster[];
}

export default function BreakingView({ clusters }: BreakingProps) {
  const [tickerIndex, setTickerIndex] = useState(0);

  // Auto-rotating system flash alert text banner
  useEffect(() => {
    if (clusters.length === 0) return;
    const interval = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % clusters.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [clusters]);

  // Dynamic status badge assigner based on text properties
  const getAlertBadge = (index: number) => {
    if (index % 3 === 0) return { label: "CRITICAL", classes: "bg-red-500/10 text-red-400 border-red-500/30" };
    if (index % 3 === 1) return { label: "FLASH", classes: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    return { label: "UPDATE", classes: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" };
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. REAL-TIME RUNNING RADAR TICKER */}
      {clusters.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-red-500/30 bg-red-950/10 p-4 backdrop-blur-xl flex items-center gap-4 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
          <span className="shrink-0 bg-red-500 text-black px-3 py-1 rounded-lg text-xs font-black tracking-widest animate-pulse">
            LIVE BROADCAST
          </span>
          <div className="flex-1 overflow-hidden relative h-5">
            <p className="text-sm font-mono font-bold text-zinc-200 truncate transition-all duration-500 transform translate-y-0">
              ⚡ {clusters[tickerIndex]?.label}
            </p>
          </div>
        </div>
      )}

      {/* 2. LIVE DATA TERMINAL GRID CONTAINER */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-6 lg:p-8 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-500 to-purple-400 uppercase tracking-wider">
              Ingested Alert Nodes
            </h2>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              PROTOCOL SOURCE: UNCLUSTERED REALTIME PACKETS
            </p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-ping" />
            <span className="text-xs font-mono tracking-widest text-zinc-400">SYS_STREAM_ACTIVE</span>
          </div>
        </div>

        {/* 3. ENHANCED CARD ARRAY */}
        <div className="space-y-4 max-h-[550px] overflow-y-auto pr-2 custom-scrollbar">
          {clusters.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 text-sm font-mono animate-pulse">
              [ Awaiting incoming payload packets... ]
            </div>
          ) : (
            clusters.map((cluster, index) => {
              const badge = getAlertBadge(index);
              return (
                <div 
                  key={cluster.id || index}
                  className="group relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-red-500/30 hover:bg-red-500/[0.01] transition-all duration-300 shadow-sm"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <span className="mt-1 text-red-500 group-hover:scale-125 transition-transform shrink-0 font-mono text-xs">
                      ⚡
                    </span>
                    <div className="space-y-1">
                      <h4 className="text-sm md:text-base font-bold text-zinc-200 group-hover:text-white transition-colors line-clamp-2">
                        {cluster.label}
                      </h4>
                      <p className="text-xs text-zinc-500 font-mono">
                        Packet Payload ID: <span className="text-zinc-400">#PX-{2026 + index}</span>
                      </p>
                    </div>
                  </div>

                  {/* ALIGNMENT CHIPS ROW */}
                  <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                    <span className={`text-[10px] font-black tracking-widest border px-2 py-1 rounded-md font-mono ${badge.classes}`}>
                      {badge.label}
                    </span>
                    <div className="text-right font-mono min-w-[70px]">
                      <p className="text-xs text-zinc-400 font-bold">{cluster.article_count || 1} Sources</p>
                      <p className="text-[10px] text-zinc-600">Cross-Ref</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}