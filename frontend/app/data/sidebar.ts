import {
  LayoutDashboard,
  Flame,
  Newspaper,
  Network,
  Globe,
  Bookmark,
  Activity,
  BarChart3,
  MapPinned,
  RefreshCcw,
  Database,
  Code2,
  Settings,
} from "lucide-react";

export const sidebarSections = [
  {
    title: "MAIN",
    items: [
      { label: "Dashboard", icon: LayoutDashboard },
      { label: "Trending", icon: Flame },
      { label: "Breaking News", icon: Newspaper },
    ],
  },

  {
    title: "DISCOVER",
    items: [
      { label: "Topic Clusters", icon: Network },
      { label: "Source Explorer", icon: Globe },
      { label: "Saved Stories", icon: Bookmark },
    ],
  },

  {
    title: "ANALYTICS",
    items: [
      { label: "News Timeline", icon: Activity },
      { label: "Topic Analytics", icon: BarChart3 },
      { label: "Geographic Insights", icon: MapPinned },
    ],
  },

  {
    title: "MANAGE",
    items: [
      { label: "Refresh Data", icon: RefreshCcw },
      { label: "Ingestion Status", icon: Database },
      { label: "API Docs", icon: Code2 },
      { label: "Settings", icon: Settings },
    ],
  },
];