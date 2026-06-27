"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import ClusterModal from "./ClusterModal";
import WelcomeScreen from "./components/WelcomeScreen";

import DashboardView from "./components/DashboardView";
import TimelineView from "./components/TimelineView";
import ClustersView from "./components/ClustersView";
import BreakingView from "./components/BreakingView";
import DefaultView from "./components/DefaultView";

type Article = {
  source?: string;
  published?: string;
  title?: string;
  summary?: string;
  url?: string;
};

type Cluster = {
  id: string | number;
  label: string;
  article_count?: number;
  articles?: Article[];
};

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [selectedCluster, setSelectedCluster] = useState<Cluster | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchClusters = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("http://localhost:5000/api/clusters");
      if (!res.ok) throw new Error("Server response not ok");
      const data = await res.json();
      setClusters(data);
    } catch (err) {
      console.error("Failed to load news clusters:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClusters();
  }, []);

  if (!entered) {
    return <WelcomeScreen onEnter={() => setEntered(true)} />;
  }

  const renderMainWorkspace = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardView clusters={clusters} onSelectCluster={setSelectedCluster} />;
      case "timeline":
      case "analytics":
        return <TimelineView clusters={clusters} />;
      case "trending":
      case "clusters":
        return <ClustersView clusters={clusters} onSelectCluster={setSelectedCluster} />;
      case "breaking":
        return <BreakingView clusters={clusters} />;
      default:
        return <DefaultView viewKey={currentView} clusters={clusters} />;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050509] text-white flex overflow-hidden">
      {/* BACKGROUND GRAPHIC */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#220033,#050509_60%)] pointer-events-none" />

      {/* SIDEBAR */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        onRefresh={fetchClusters} 
        isRefreshing={isRefreshing} 
        
      />

      {/* WORKSPACE CONTENT AREA */}
      <div className="flex-1 h-screen overflow-y-auto custom-scrollbar relative z-10">
        <div className="w-full px-6 py-10 lg:px-12 max-w-[1600px] mx-auto space-y-8">
          
          {/* TITLE BAR */}
          <header className="border-b border-white/5 pb-6">
            <p className="text-xs uppercase tracking-[0.4em] text-pink-400 font-bold mb-1">
              PulseX System Node
            </p>
            <h1 className="text-4xl font-black uppercase tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              {currentView.replace("-", " ")}
            </h1>
          </header>

          {/* RENDERS VIEW */}
          <main className="pb-16">
            {renderMainWorkspace()}
          </main>

        </div>
      </div>

      {selectedCluster && (
        <ClusterModal cluster={selectedCluster} onClose={() => setSelectedCluster(null)} />
      )}
    </div>
  );
}