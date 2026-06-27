"use client";

import { useState, useEffect } from "react";
import SourceExplorer from "./SourceExplorer";

type Cluster = {
  label: string;
  article_count?: number;
};

interface DefaultViewProps {
  viewKey: string;
  clusters: Cluster[];
}

export default function DefaultView({ viewKey, clusters }: DefaultViewProps) {
  // STATE MACHINERY: Live telemetry simulation flags
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("10:35:00 AM");
  const [fetchCounter, setFetchCounter] = useState(14200);

  // ==============================================================
  // 🎯 CORE STATE FOR SOURCE TOGGLES (This fixes the missing props error!)
  // ==============================================================
  const [selectedSources, setSelectedSources] = useState<string[]>([
    "BBC News",
    "NPR Feed",
    "TechCrunch RSS",
    "Wired Stream",
    "Bloomberg Wire"
  ]);

  // Handler to toggle sources in state array
  const handleToggleSource = (sourceName: string) => {
    setSelectedSources((prev) =>
      prev.includes(sourceName)
        ? prev.filter((src) => src !== sourceName)
        : [...prev, sourceName]
    );
  };

  // Manual trigger handler to simulate network socket updates
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
      setFetchCounter((prev) => prev + Math.floor(Math.random() * 8) + 2);
    }, 900); // 900ms mock network latency delay
  };

  // Automated background scheduler (Background synchronization pulse)
  useEffect(() => {
    const autoPulse = setInterval(() => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString());
      setFetchCounter((prev) => prev + 1);
    }, 8000); // Automate background fetch every 8 seconds

    return () => clearInterval(autoPulse);
  }, []);
  
  const renderViewContent = () => {
    switch (viewKey) {
      case "source-explorer":
        // PASSING THE REQUIRED FILTERS TO ELIMINATE THE TYPESCRIPT MISMATCH
        return (
          <SourceExplorer 
            clusters={clusters} 
            selectedSources={selectedSources}
            onToggleSource={handleToggleSource}
          />
        );
        
      case "saved":
        return (
          <div className="space-y-10 w-full animate-fade-in text-left px-4 py-4">
            <div className="border-b border-white/10 pb-8 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
              <div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">OFFLINE INTEL DATA-STORE</h2>
                <p className="text-sm md:text-xl text-pink-400 font-mono mt-3 tracking-wide">TOTAL BOOKMARKS RETAINED: 2 ARCHIVED MATRIX REPORTS</p>
              </div>
              <div className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 font-mono text-xs md:text-sm text-pink-300">
                SECURE STORAGE: <span className="font-bold text-white">84.2 MB USED</span> / 5 GB MAX
              </div>
            </div>

            <div className="flex flex-wrap gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-2xl font-mono text-sm">
              <span className="text-zinc-500 py-1">FILTER SUBSYSTEMS:</span>
              <button className="px-4 py-1 bg-pink-500 text-black font-bold rounded-lg">ALL BINDINGS</button>
              <button className="px-4 py-1 bg-white/5 text-zinc-400 hover:bg-white/10 rounded-lg">CRITICAL ONES</button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "Global Semiconductor Market Shift Analysis", category: "TECH", date: "June 26, 2026", note: "Flagged for quarterly research report.", integrity: "98.4%", hash: "SHA-256::7F8B2" },
                { title: "Federal Reserve Adjustments and Market Signals", category: "FINANCE", date: "June 25, 2026", note: "Review for regression modeling.", integrity: "99.1%", hash: "SHA-256::A1E92" },
              ].map((item, i) => (
                <div key={i} className={`p-8 md:p-10 rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-950 to-black backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-8 hover:border-pink-500/30 transition-all shadow-2xl ${isRefreshing ? "opacity-40 scale-[0.99]" : ""} transition-all duration-300`}>
                  <div className="space-y-4 flex-1">
                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-xs md:text-sm font-mono font-black bg-pink-500/10 text-pink-400 border border-pink-500/20 px-4 py-1.5 rounded-xl">{item.category}</span>
                      <span className="text-sm md:text-base text-zinc-500 font-mono">{item.date}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{item.title}</h3>
                    <p className="text-base md:text-lg text-zinc-400 italic font-medium">“{item.note}”</p>
                  </div>
                  <div className="flex md:flex-col gap-3 self-start md:self-auto w-full md:w-auto">
                    <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-black px-8 py-4 rounded-2xl text-base font-mono font-black transition-all shadow-lg shadow-pink-500/10">
                      DECRYPT DATA
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "source-stats":
        return (
          <div className="space-y-10 w-full animate-fade-in text-left px-4 py-4">
            <div className="border-b border-white/10 pb-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">VOLUMETRIC METRICS LAYER</h2>
              <p className="text-sm md:text-xl text-purple-400 font-mono mt-3 tracking-wide">TELEMETRY SOURCE BALANCER INDEX & FLOW RATES</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Total Sources Connected", value: `${selectedSources.length} Nodes`, sub: `Pipeline ticks: ${fetchCounter}`, color: "text-purple-400" },
                { title: "System Avg Integrity", value: "99.42%", sub: "Nominal operations status", color: "text-emerald-400" },
                { title: "Data Stream Volume", value: "4.2 GB/day", sub: `Last Stream Sync: ${lastUpdated}`, color: "text-cyan-400" },
                { title: "Redis Cache Hits", value: "94.1%", sub: "Memory cluster distribution dynamic", color: "text-pink-400" },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-zinc-900/50 to-black space-y-4 shadow-xl">
                  <p className="text-xs md:text-sm text-zinc-500 font-mono tracking-widest uppercase font-bold">{stat.title}</p>
                  <h3 className="text-4xl md:text-5xl font-black text-white font-mono tracking-tighter">{stat.value}</h3>
                  <p className={`text-xs md:text-sm ${stat.color} font-mono font-medium`}>● {stat.sub}</p>
                </div>
              ))}
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="p-8 rounded-3xl border border-white/5 bg-black/40 space-y-6">
                <h3 className="text-base md:text-lg font-black text-zinc-300 uppercase tracking-wider font-mono">// INGESTION INBOUND CHANNEL SHARE</h3>
                {[
                  { label: "RSS Feeds Extraction Engine", val: "75%", color: "bg-cyan-500" },
                  { label: "AI Matrix Scraper Core Nodes", val: "91%", color: "bg-purple-500" },
                ].map((bar, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between text-sm md:text-base font-mono">
                      <span className="text-zinc-400 font-bold">{bar.label}</span>
                      <span className="text-white font-black">{bar.val}</span>
                    </div>
                    <div className="w-full bg-zinc-950 h-4 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <div className={`${bar.color} h-full rounded-full`} style={{ width: bar.val }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "ingestion":
        return (
          <div className="space-y-10 w-full animate-fade-in text-left px-4 py-4">
            <div className="border-b border-white/10 pb-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">INGESTION PIPELINE MANAGEMENT</h2>
              <p className="text-sm md:text-xl text-emerald-400 font-mono mt-3 tracking-wide">CORE CONFIGURATION CONSOLE LAYER: ACTIVE INTEGRATION RUNNING</p>
            </div>
            
            <div className="p-8 md:p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 to-black backdrop-blur-xl space-y-8 shadow-2xl">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-white/5 pb-6">
                <div>
                  <h3 className="font-mono text-xl md:text-2xl font-black text-white">PIPELINE ENGINE WORKERS v2.6.0</h3>
                  <p className="text-sm md:text-base text-zinc-500 font-mono mt-1">Total Packets Tracked: <span className="text-white font-bold">{fetchCounter}</span></p>
                </div>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs md:text-sm font-mono font-black px-6 py-2.5 rounded-full animate-pulse tracking-widest uppercase">SYSTEM_ONLINE</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm md:text-base">
                {[
                  { label: "Fetch Stack Multi-Workers Cluster", status: isRefreshing ? "FETCHING" : "ONLINE", color: isRefreshing ? "text-yellow-400" : "text-emerald-400", meta: `Last ping check at ${lastUpdated}` },
                  { label: "Payload Tokenization Sync Engine", status: "SYNCED", color: "text-emerald-400", meta: "Latency 4ms" },
                ].map((proc, i) => (
                  <div key={i} className="p-5 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col justify-between gap-3">
                    <div className="flex justify-between items-start">
                      <span className="text-zinc-400 font-bold">▸ {proc.label}</span>
                      <span className={`font-black tracking-wider text-sm md:text-base ${proc.color}`}>{proc.status}</span>
                    </div>
                    <span className="text-xs text-zinc-600 font-mono uppercase">{proc.meta}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "geo":
        return (
          <div className="space-y-10 w-full animate-fade-in text-left px-4 py-4">
            <div className="border-b border-white/10 pb-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">SPATIAL TELEMETRY DISTRIBUTIONS</h2>
              <p className="text-sm md:text-xl text-amber-400 font-mono mt-3 tracking-wide">GLOBAL TARGET REGION MAPPING SEGMENTATION MATRIX</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { region: "North America Cluster Zone", traffic: "High Boundary Load", load: "W-78%", ping: "22ms" },
              ].map((reg, i) => (
                <div key={i} className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-950 to-black space-y-6 shadow-2xl flex flex-col justify-between">
                  <div className="space-y-3">
                    <h4 className="font-black text-zinc-100 text-xl md:text-2xl tracking-tight leading-tight">{reg.region}</h4>
                    <p className="text-sm text-zinc-500 font-mono font-medium">● STREAM RE-SYNC POOL TIME: {lastUpdated}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "settings":
        return (
          <div className="space-y-10 w-full animate-fade-in text-left px-4 py-4">
            <div className="border-b border-white/10 pb-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">ALGORITHMIC PARAMETERS</h2>
              <p className="text-sm md:text-xl text-pink-400 font-mono mt-3 tracking-wide">SYSTEM RECONFIGURATION CONTROL PANEL</p>
            </div>
            <div className="p-8 md:p-10 rounded-3xl border border-white/5 bg-black/40 space-y-8">
              <h3 className="text-lg md:text-xl font-black text-pink-400 uppercase tracking-wider font-mono">// ENGINE RE-INDEX TIMESTAMP: {lastUpdated}</h3>
            </div>
          </div>
        );

      case "api":
        return (
          <div className="space-y-10 w-full animate-fade-in text-left px-4 py-4">
            <div className="border-b border-white/10 pb-8">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white uppercase leading-none">SYSTEM API SPECIFICATION</h2>
              <p className="text-sm md:text-xl text-purple-400 font-mono mt-3 tracking-wide">REST LAYER ENDPOINT CONTRACTS</p>
            </div>
            <div className="p-8 md:p-10 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-950 to-black font-mono text-sm space-y-6 shadow-2xl">
              <span className="text-zinc-100 font-mono font-black select-all tracking-tight break-all">/api/v1/telemetry/clusters/nodes?sync={fetchCounter}</span>
            </div>
          </div>
        );

      default:
        return (
          <div className="w-full text-center py-32 rounded-3xl border border-pink-500/10 bg-black/40 backdrop-blur-xl animate-fade-in space-y-6">
            <div className="text-6xl text-pink-400 animate-pulse">✦</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-pink-400 uppercase">Module Terminal Sync</h2>
          </div>
        );
    }
  };

  return (
    <div className="w-full p-4 md:p-10 min-h-screen relative space-y-6">
      <div className="w-full bg-gradient-to-r from-zinc-950 via-zinc-900 to-black border border-white/10 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-[0_0_40px_rgba(255,255,255,0.02)]">
        <div className="font-mono">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isRefreshing ? "bg-amber-400 animate-ping" : "bg-cyan-400 animate-pulse"}`} />
            <span className="text-sm text-zinc-400 font-bold uppercase tracking-wider">LIVE TELEMETRY STREAMS</span>
          </div>
          <p className="text-xs text-zinc-500 mt-1 uppercase">
            Last Network Core Handshake: <span className="text-cyan-400 font-bold">{lastUpdated}</span> | Packets Ingested: <span className="text-purple-400 font-black">{fetchCounter}</span>
          </p>
        </div>
        
        <button 
          onClick={handleManualRefresh}
          disabled={isRefreshing}
          className={`px-8 py-3.5 rounded-2xl font-mono text-sm font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 border ${
            isRefreshing 
              ? "bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed" 
              : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-transparent shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)] hover:scale-[1.02] active:scale-[0.98]"
          }`}
        >
          <svg className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.253 8H18" />
          </svg>
          {isRefreshing ? "Ingesting Core Data..." : "Refresh News Node"}
        </button>
      </div>

      <div className="w-full">
        {renderViewContent()}
      </div>
    </div>
  );
}