import sqlite3
import feedparser
import requests
from bs4 import BeautifulSoup
import re
import time
import hashlib

# Basic common English stop words to strip out for matching
STOP_WORDS = set([
    "the", "a", "an", "and", "or", "but", "in", "on", "at", "to", "for", "with", "by", 
    "of", "from", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", 
    "it", "its", "they", "them", "their", "this", "that", "these", "those", "says", "said", 
    "will", "would", "can", "could", "about", "after", "new", "more", "over", "us", "uk", "not"
])

FEEDS = {
    "BBC News": "http://feeds.bbci.co.uk/news/rss.xml",
    "NPR": "https://feeds.npr.org/1001/rss.xml"
}

def clean_and_tokenize(text):
    """Lowercases, clears punctuation, and removes stop words to extract pure keywords."""
    if not text:
        return []
    words = re.findall(r'\b[a-z]{3,}\b', text.lower())
    return [w for w in words if w not in STOP_WORDS]

def fetch_articles():
    articles = []
    for source, url in FEEDS.items():
        print(f"Fetching from {source}...")
        feed = feedparser.parse(url)
        for entry in feed.entries:
            title = entry.get('title', '')
            summary = entry.get('summary', '')
            link = entry.get('link', '')
            
            # Use uniform current time if published date parsing fails or is missing
            pub_time_struct = entry.get('published_parsed', None)
            pub_timestamp = int(time.mktime(pub_time_struct)) if pub_time_struct else int(time.time())
            
            # Unique stable ID string based on URL
            article_id = hashlib.md5(link.encode('utf-8')).hexdigest()
            
            articles.append({
                "id": article_id,
                "title": title,
                "summary": summary,
                "url": link,
                "source": source,
                "published_time": pub_timestamp,
                "keywords": clean_and_tokenize(title + " " + summary)
            })
    return articles

def run_pipeline():
    fetched = fetch_articles()
    if not fetched:
        return

    # In-memory grouping algorithm (Keyword word overlap threshold)
    clusters_map = {} # cluster_id -> list of articles
    
    for art in fetched:
        matched_cluster_id = None
        art_keywords_set = set(art["keywords"])
        
        for c_id, c_articles in clusters_map.items():
            # Compare against the first/representative article keywords in the cluster
            rep_keywords = set(c_articles[0]["keywords"])
            overlap = art_keywords_set.intersection(rep_keywords)
            
            # Threshold requirement: if they share 3 or more unique keywords, they belong together
            if len(overlap) >= 3:
                matched_cluster_id = c_id
                break
                
        if matched_cluster_id:
            clusters_map[matched_cluster_id].append(art)
        else:
            # Create a brand new logical cluster
            new_c_id = f"cluster_{int(time.time())}_{len(clusters_map)}"
            clusters_map[new_c_id] = [art]

    # Sync and write to SQLite
    conn = sqlite3.connect('news.db')
    cursor = conn.cursor()
    
    # ─── FORCE REBUILD TABLES TO FIX SCHEMA CONFLICTS ────────────────────
    # Clearing old tables avoids layout column mismatch crashes completely
    cursor.execute('DROP TABLE IF EXISTS articles')
    cursor.execute('DROP TABLE IF EXISTS clusters')
    
    cursor.execute('''
        CREATE TABLE clusters (
            id TEXT PRIMARY KEY,
            label TEXT,
            article_count INTEGER,
            start_time INTEGER,
            end_time INTEGER
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE articles (
            id TEXT PRIMARY KEY,
            cluster_id TEXT,
            title TEXT,
            summary TEXT,
            url TEXT,
            source TEXT,
            published_time INTEGER,
            FOREIGN KEY (cluster_id) REFERENCES clusters (id)
        )
    ''')
    # ──────────────────────────────────────────────────────────────────────
    
    for c_id, c_articles in clusters_map.items():
        # Derive timeline limits
        timestamps = [a["published_time"] for a in c_articles]
        start_t = min(timestamps)
        # Add buffer window for visualization if single article
        end_t = max(timestamps) if max(timestamps) != min(timestamps) else min(timestamps) + 3600 
        
        # Determine labels using top 3 shared/common terms
        all_words = []
        for a in c_articles:
            all_words.extend(a["keywords"])
        
        word_counts = {}
        for w in all_words:
            word_counts[w] = word_counts.get(w, 0) + 1
        sorted_words = sorted(word_counts.items(), key=lambda x: x[1], reverse=True)
        label_terms = [pair[0].capitalize() for pair in sorted_words[:3]]
        cluster_label = " / ".join(label_terms) if label_terms else "General News"

        # Insert cluster records
        cursor.execute('''
            INSERT OR REPLACE INTO clusters (id, label, article_count, start_time, end_time)
            VALUES (?, ?, ?, ?, ?)''', (c_id, cluster_label, len(c_articles), start_t, end_t))
            
        for a in c_articles:
            cursor.execute('''
                INSERT OR IGNORE INTO articles (id, cluster_id, title, summary, url, source, published_time)
                VALUES (?, ?, ?, ?, ?, ?, ?)''', (a["id"], c_id, a["title"], a["summary"], a["url"], a["source"], a["published_time"]))
                
    conn.commit()
    conn.close()
    print("Scraping and clustering process successfully finalized!")

if __name__ == "__main__":
    run_pipeline()