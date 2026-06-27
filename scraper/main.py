
import feedparser
import sqlite3
import trafilatura

# DATABASE CONNECT
conn = sqlite3.connect("news.db")
cursor = conn.cursor()

# CREATE TABLE
cursor.execute("""
CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    summary TEXT,
    content TEXT,
    link TEXT UNIQUE,
    published TEXT,
    source TEXT
)
""")

# ADD MISSING COLUMNS (SAFE)
try:
    cursor.execute("ALTER TABLE articles ADD COLUMN summary TEXT")
except:
    pass

try:
    cursor.execute("ALTER TABLE articles ADD COLUMN content TEXT")
except:
    pass

# RSS FEEDS
feeds = [
    ("BBC", "http://feeds.bbci.co.uk/news/rss.xml"),
    ("NPR", "https://feeds.npr.org/1001/rss.xml"),
    ("NYTimes", "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml")
]

# FETCH NEWS
for source, feed_url in feeds:

    print(f"\nFetching from {source}...\n")

    feed = feedparser.parse(feed_url)

    for entry in feed.entries[:5]:

        try:

            title = entry.title
            link = entry.link

            published = entry.get("published", "No Date")

            summary = entry.get("summary", "")

            print(f"Fetching full article: {title}")

            # FETCH FULL ARTICLE
            downloaded = trafilatura.fetch_url(link)

            full_content = ""

            if downloaded:
                extracted = trafilatura.extract(downloaded)

                if extracted:
                    full_content = extracted

            # FALLBACK
            if not full_content:
                full_content = summary

            # SAVE TO DATABASE
            cursor.execute("""
            INSERT OR IGNORE INTO articles
            (
                title,
                summary,
                content,
                link,
                published,
                source
            )
            VALUES (?, ?, ?, ?, ?, ?)
            """, (
                title,
                summary,
                full_content,
                link,
                published,
                source
            ))

            print(f"Saved: {title}")

        except Exception as e:
            print("Error:", e)

# SAVE CHANGES
conn.commit()

print("\n🎉 News saved successfully with full articles!")

