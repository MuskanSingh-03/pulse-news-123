"use client";

type Article = {
  source?: string;
  published_time?: number;
  title?: string;
  summary?: string;
  url?: string;
};

type ClusterWithArticles = {
  label?: string;
  articles?: Article[];
};

type ClusterModalProps = {
  cluster: ClusterWithArticles | null;
  onClose: () => void;
};

export default function ClusterModal({ cluster, onClose }: ClusterModalProps) {
  if (!cluster) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
      {/* MODAL WINDOW */}
      <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-pink-500/20 bg-[#090b17] shadow-[0_0_60px_rgba(255,0,180,0.15)]">
        
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:40px_40px]" />

        {/* HEADER */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#090b17]/90 p-6 backdrop-blur-xl">
          <div>
            <h2 className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-4xl font-black text-transparent">
              {cluster.label || "News Cluster"}
            </h2>
            <p className="mt-2 text-zinc-400">
              {(cluster.articles?.length || 0)} Articles
            </p>
          </div>

          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-xl text-zinc-400 transition-all hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* ARTICLES PANEL */}
        <div className="relative z-10 p-6 space-y-6">
          {(cluster.articles?.length || 0) === 0 && (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
              <p className="text-xl text-zinc-300">No articles available.</p>
            </div>
          )}

          {cluster.articles?.map((article, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-white/10 bg-white/[0.03] p-6 transition-all duration-300 hover:border-pink-500/30 hover:bg-pink-500/[0.04] hover:shadow-[0_0_30px_rgba(255,0,180,0.12)]"
            >
              {/* TOP METADATA ROW */}
              <div className="mb-4 flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-pink-500/20 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-4 py-1 text-xs font-semibold text-pink-300">
                  {article.source || "Unknown"}
                </span>
                <span className="text-sm text-zinc-500">
                  {article.published_time
                    ? new Date(article.published_time * 1000).toLocaleString()
                    : "Unknown date"}
                </span>
              </div>

              {/* TITLE */}
              <h3 className="mb-4 text-2xl font-bold leading-tight text-white transition-all group-hover:text-pink-300">
                {article.title || "Untitled"}
              </h3>

              {/* SUMMARY */}
              <p className="mb-6 leading-relaxed text-zinc-300">
                {article.summary || "No summary available."}
              </p>

              {/* OUTBOUND ACTION LINK */}
              <a
                href={article.url || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-pink-500/20 bg-gradient-to-r from-pink-500/10 to-purple-500/10 px-5 py-3 text-sm font-semibold text-pink-300 transition-all hover:border-pink-400/40 hover:text-white hover:shadow-[0_0_25px_rgba(255,0,180,0.2)]"
              >
                Read Full Article →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}