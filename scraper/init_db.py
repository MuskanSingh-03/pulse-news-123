import sqlite3

conn = sqlite3.connect('news.db')
cursor = conn.cursor()

# 1. Table for grouping topics
cursor.execute('''
CREATE TABLE IF NOT EXISTS clusters (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    article_count INTEGER DEFAULT 0,
    start_time INTEGER,
    end_time INTEGER
)''')

# 2. Table for articles linked to a cluster
cursor.execute('''
CREATE TABLE IF NOT EXISTS articles (
    id TEXT PRIMARY KEY,
    cluster_id TEXT,
    title TEXT NOT NULL,
    summary TEXT,
    url TEXT,
    source TEXT,
    published_time INTEGER,
    FOREIGN KEY(cluster_id) REFERENCES clusters(id)
)''')

# 3. Table for tracking background ingestion run statuses
cursor.execute('''
CREATE TABLE IF NOT EXISTS ingestion_jobs (
    id TEXT PRIMARY KEY,
    status TEXT DEFAULT 'PENDING',
    created_at INTEGER
)''')

conn.commit()
conn.close()
print("Database tables initialized successfully!")