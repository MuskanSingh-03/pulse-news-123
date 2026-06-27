# 🛰️ News Pulse: Advanced Topic-Clustered News Timeline Engine

News Pulse is an automated, production-ready full-stack software system designed to aggregate, normalize, enrich, and visually map real-time global news events. 
The system continuously monitors diverse, fragmented public RSS feeds, extracts the full core text content from target web pages via custom sanitization pipelines, executes an optimized word-overlap clustering algorithm to discover unified logical topics, and projects these events along an interactive visual timeline frontend dashboard[cite: 1, 2, 4].

---

## 🏗️ Detailed System Architecture & Data Flow

The application is engineered with a strict decoupled micro-architecture consisting of three core modules:

┌────────────────┐         ┌──────────────────┐         ┌──────────────────┐
│  Python Agent  │ ──────> │  SQLite Database │ <────── │  Node.js API     │
│  (Scrape & NLP)│         │    (news.db)     │         │  (Express Engine)│
└────────────────┘         └──────────────────┘         └──────────────────┘
▲                                                        │
│               Trigger Ingestion & Poll Status           │
└────────────────────────────────────────────────────────┘
│
▼
┌──────────────────┐
│  Next.js 14 App  │
│ (React Dashboard)│
└──────────────────┘


*   **/scraper (Data Aggregator Node)**: A standalone Python script that performs non-blocking networking calls to cross-origin endpoints, maps mismatched RSS item schemas into a normalized object, isolates high-density structural text segments via DOM parsing, filters common English stop words, and groups corresponding stories together[cite: 1, 4].

*   **/backend (RESTful Routing Engine)**: A lightweight Node.js Express server acting as the transactional middleware between the user interfaces and the persistence storage[cite: 2]. It isolates resource-intensive script tasks inside multi-threaded asynchronous sub-processes, preventing event-loop freezing and providing a smooth user experience via tracking IDs[cite: 2].

*   **/frontend (Interactive Visualization Shell)**: A modern Next.js React application styled with atomic utilities via Tailwind CSS[cite: 1, 3]. It transforms flat timestamp metadata sets into dynamic linear visual charts while enabling fluid filtering states by source channels and manual workflow updates[cite: 3].

---

## 🚀 Live Deployments

*   **Production Frontend UI App (Vercel / Netlify):** `https://pulse-news-123.vercel.app/`[cite: 1]
*   **Production API Routing Gateway (Railway / Render):** `https://pulse-news-123-1.onrender.com`[cite: 1]

---

## 🛠️ Complete Technical Stack Matrix

| Architectural Layer | Core Framework / Tooling | Deployment Target / Strategy |
| :--- | :--- | :--- |
| **User Interface** | Next.js 14 (App Router), React, TailwindCSS[cite: 1] | Vercel or Netlify (Edge Infrastructure)[cite: 1] |
| **API Gateway** | Node.js, Express.js, Child Process Sub-modules[cite: 2] | Railway or Render Web Service Containers[cite: 1] |
| **Data Storage** | SQLite 3 (Structured Relational Layer)[cite: 2] | Persistent Volume / Managed Git Directory Storage[cite: 2] |
| **Ingestion Pipeline** | Python 3, Feedparser, BeautifulSoup4, Requests[cite: 1, 4] | On-Demand Node Environment Invocation[cite: 1, 2] |

### Monitored Global Channels & Resource Feeds[cite: 1, 4]
*   **BBC News Stream:** `http://feeds.bbci.co.uk/news/rss.xml` (Format structures description targets)[cite: 1, 4]
*   **National Public Radio (NPR):** `https://feeds.npr.org/1001/rss.xml` (Handles granular global events)[cite: 1, 4]
*   **Al Jazeera Broadcast:** `https://www.aljazeera.com/xml/rss/all.xml` (Ensures global third-party coverage)

---

## 🧠 Clustering Methodology, Parameters & Limitations

### 1. Linguistic Tokenization & Data Normalization[cite: 4]
Raw texts arriving from different feeds contain inconsistent fields and formatting anomalies (e.g., `<description>` formats vs `<content:encoded>`)[cite: 1]. The script pulls strings from headlines, summaries, and full HTML body segments, normalizes everything to lowercase, strips formatting markup characters, and runs a comprehensive regex engine filtering out common English stop words (e.g., *the, and, with, from, says, will*)[cite: 4].

### 2. The Word-Overlap Clustering Algorithm[cite: 4]
Instead of utilizing memory-intensive vector embedding models, this system applies an elegant, deterministic **Keyword Overlap Threshold matching pattern**[cite: 1, 4]:
*   **Cluster Iteration**: Each incoming article transforms into an array of distinct tokens[cite: 4]. The engine loops through all existing active clusters and matches these tokens against the first (anchor/representative) document of that cluster[cite: 4].
*   **Matching Threshold Parameters**: Through empirical configuration tuning, the overlap threshold constraint was set to **$\ge 3$ unique matching words**. If an incoming item shares 3 or more meaningful terms (e.g., `"senate"`, `"election"`, `"vote"`) with the anchor document, it is immediately assigned to that cluster[cite: 4].
*   **Dynamic Label Synthesis**: Cluster names are not static numbers; they are dynamically synthesized by analyzing the cumulative token frequencies across all articles within that group[cite: 4]. The top 3 highest-ranking terms are capitalized and joined using standard delimiters (e.g., `"Election / Senate / Vote"`)[cite: 4].
*   **Timeline Boundary Mapping**: The cluster's `start_time` and `end_time` bounds are mapped based on the minimum and maximum unix timestamps of its contained articles[cite: 4]. If a cluster contains only a single article, a 1-hour temporal window buffer ($3600\text{s}$) is automatically added to ensure it renders correctly on visual charting grids[cite: 4].

### 3. Critical System Limitations[cite: 1]
*   **Synonym Blindness**: The comparison logic checks for literal matching characters. If two outlets publish articles regarding the same event but one uses the term *"aviation"* while the other utilizes *"airplane"*, the algorithm might fail to group them unless they share other common keywords.
*   **Representative Anchor Drift**: Because incoming elements are evaluated against the *first* original article of a cluster instead of a dynamic moving average centroid, long-term evolving stories might experience slight semantic drifting over time[cite: 4].

---

## 🔌 Fully Documented API Schema & Endpoint Registry

| HTTP Method | API Endroute Path | Success Code | Data Schema / Payload Structure | Functional Scope |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/clusters` | `200 OK` | `Array<Object>` (id, label, article_count, start_time, end_time) | Returns a compiled collection of all discovered topic clusters ordered by size[cite: 2, 4]. |
| **GET** | `/api/clusters/:id` | `200 OK` | `Array<Object>` (id, title, summary, url, source, published) | Fetches chronological individual article segments linked to the given cluster ID[cite: 2]. |
| **GET** | `/api/timeline` | `200 OK` | `Array<Object>` (id, label, startTime, endTime, intensity) | Formats time-axis boundaries into millisecond intervals optimal for charting engines[cite: 2]. |
| **POST** | `/api/ingest/trigger` | `202 Accepted` | `Object` (jobId, status) | Spawns the scraping runtime asynchronously as a system sub-process without blocking UI operations[cite: 2]. |
| **GET** | `/api/ingest/status/:jobId` | `200 OK` | `Object` (status, error) | Allows client polling clients to check ongoing job lifecycle status (`processing`, `completed`, `failed`)[cite: 2]. |

---

## ⚙️ Environment Configurations

Populate corresponding local configuration variables before scaling up cloud pipelines[cite: 1]:

### `/backend` Configuration Layout (`.env`)[cite: 1]
```env
PORT=5000
/frontend Configuration Layout (.env.local)
[cite: 1]
Code snippet
NEXT_PUBLIC_API_URL=[https://pulse-news-123-1.onrender.com](https://pulse-news-123-1.onrender.com)
📦 Step-By-Step Local Installation Guide

1. Initialize Pipeline Utilities & Run Local Scrape
Bash
cd scraper
pip install feedparser requests beautifulsoup4
python cluster.py

2. Boot Up API Middleware Node
Bash
cd ../backend
npm install
npm start

3. Spin Up Next.js Frontend Shell
Bash
cd ../frontend
npm install
npm run dev

