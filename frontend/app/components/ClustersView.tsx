"use client";

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

interface ClustersProps {
  clusters: Cluster[];
  onSelectCluster: (cluster: Cluster) => void;
}

export default function ClustersView({ clusters, onSelectCluster }: ClustersProps) {
  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-black mb-8 text-cyan-400">Active Intelligence Clusters</h2>
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
            className="group rounded-3xl border border-white/10 bg-black/40 p-7 text-left hover:border-pink-500/40 hover:bg-pink-500/[0.02] transition-all hover:scale-[1.01]"
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
  );
}