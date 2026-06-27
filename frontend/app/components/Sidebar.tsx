"use client";

import { useState } from "react";

interface SidebarItem {
  name: string;
  viewKey: string;
}

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function Sidebar({ currentView, onViewChange, onRefresh, isRefreshing }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    {
      title: "------DISCOVER------",
      items: [
        { name: "Dashboard", viewKey: "dashboard" },
        { name: "Trending Now", viewKey: "trending" },
        { name: "Breaking News", viewKey: "breaking" },
        { name: "Topic Clusters", viewKey: "clusters" },
        { name: "Source Explorer", viewKey: "source-explorer" },
        { name: "Saved Stories", viewKey: "saved" },
      ] as SidebarItem[],
    },
    {
      title: "------ANALYTICS------",
      items: [
        { name: "News Timeline", viewKey: "timeline" },
        { name: "Topic Analytics", viewKey: "analytics" },
        { name: "Source Stats", viewKey: "source-stats" },
        { name: "Geographic Insights", viewKey: "geo" },
      ] as SidebarItem[],
    },
    {
      title: "-------MANAGE------",
      items: [
        { name: "Refresh Data", viewKey: "refresh" },
        { name: "Ingestion Status", viewKey: "ingestion" },
        { name: "Settings", viewKey: "settings" },
        { name: "API Docs", viewKey: "api" },
      ] as SidebarItem[],
    },
  ];

  return (
    <aside
      className={`
        relative h-screen overflow-hidden border-r border-pink-500/20
        bg-gradient-to-b from-[#14051f] via-[#0d1025] to-[#07111f] backdrop-blur-2xl
        transition-all duration-300 shrink-0
        ${collapsed ? "w-[95px]" : "w-[320px]"}
      `}
    >
      {/* GLOWS & GRID */}
      <div className="absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-pink-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-500/20 blur-4xl" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:35px_35px]" />

      <div className="relative z-10 flex h-full flex-col">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          {!collapsed && (
            <div>
              <h1 className="text-5xl font-black tracking-tight">
                <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  PulseX
                </span>
              </h1>
              <p className="mt-3 text-xs font-semibold tracking-[0.35em] text-pink-300/70">
                AI NEWS INTELLIGENCE
              </p>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="rounded-2xl border border-pink-500/20 bg-white/[0.05] p-3 text-lg transition-all hover:border-pink-400/40 hover:bg-pink-500/10"
          >
            {collapsed ? "☰" : "☷"}
          </button>
        </div>

        {/* NAVIGATION */}
        <div className="flex-1 overflow-y-auto px-4 py-8">
          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                {!collapsed && (
                  <p className="mb-6 px-3 text-xs font-bold tracking-[0.3em] bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
                    {section.title}
                  </p>
                )}

                <div className="space-y-3">
                  {section.items.map((item) => {
                    const isActive = currentView === item.viewKey;
                    return (
                      <button
                        key={item.name}
                        onClick={() => {
                          if (item.viewKey === "refresh") {
                            onRefresh?.();
                          } else {
                            onViewChange(item.viewKey);
                          }
                        }}
                        className={`
                          group relative flex w-full items-center gap-4 overflow-hidden rounded-3xl border px-4 py-5 text-left transition-all duration-300
                          ${
                            isActive
                              ? `border-pink-500/60 bg-pink-500/10 shadow-[0_0_30px_rgba(255,0,180,0.25)]`
                              : `border-white/5 bg-white/[0.03] hover:border-pink-500/30 hover:bg-pink-500/10`
                          }
                        `}
                      >
                        <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-r from-pink-500/10 to-cyan-500/10" />
                        <div className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-lg ${isActive ? 'from-cyan-500 to-pink-500 text-white shadow-[0_0_15px_rgba(255,0,180,0.5)]' : 'from-pink-500/20 to-cyan-500/20 text-pink-300'}`}>
                          ✦
                        </div>
                        {!collapsed && (
                          <div className="relative z-10 flex flex-col gap-1">
                            <p className={`font-semibold ${isActive ? 'text-pink-300' : 'bg-gradient-to-r from-pink-300 to-cyan-300 bg-clip-text text-transparent'}`}>
                              {item.name === "Refresh Data" && isRefreshing ? "Refreshing..." : item.name}
                            </p>
                            <p className="text-xs text-purple-300/70">AI powered module</p>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* PROFILE CARD */}
        <div className="border-t border-white/10 p-4">
          <div className="rounded-2xl border border-pink-500/20 bg-white/[0.04] p-3 backdrop-blur-xl">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 text-xl font-black shadow-[0_0_30px_rgba(255,0,180,0.35)] text-white">
                M
              </div>
              {!collapsed && (
                <div>
                  <p className="bg-gradient-to-r from-pink-400 to-white bg-clip-text font-semibold text-transparent">
                    Muskan
                  </p>
                  <p className="text-sm text-zinc-400">Developer</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}