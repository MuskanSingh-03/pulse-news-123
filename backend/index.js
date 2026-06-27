const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { exec } = require("child_process"); // Added to trigger python on demand

const app = express();
const PORT = process.env.PORT || 5000;

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// DATABASE PATH CONFIGURATION
const dbPath = path.join(__dirname, "../scraper/news.db");
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ Database connection error:", err.message);
    } else {
        console.log("✅ Connected to the SQLite database successfully.");
    }
});

// 1. TEST ROUTE
app.get("/", (req, res) => {
    res.send("News Pulse Backend API is running perfectly! 🚀");
});

// 2. GET & TRIGGER LIVE REFRESH CLUSTERS API
app.get("/api/clusters", (req, res, next) => {
    // Path to your python script folder
    const scriptPath = path.join(__dirname, "../scraper/cluster.py");
    
    console.log("🔄 Running news aggregator script...");
    // Execute python script to fetch real-time news before returning rows
    exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Scraper Error: ${error.message}`);
            // Don't crash the server, fall through to serve existing cached DB rows anyway
        }
        
        const query = "SELECT * FROM clusters ORDER BY article_count DESC";
        db.all(query, [], (err, rows) => {
            if (err) {
                return next(err);
            }
            res.json(rows);
        });
    });
});

// 3. GET ARTICLES BY CLUSTER ID API
app.get("/api/clusters/:id", (req, res, next) => {
    const clusterId = req.params.id;
    const query = `
        SELECT 
            id, 
            cluster_id, 
            title, 
            summary, 
            url, 
            source, 
            datetime(published_time, 'unixepoch', 'localtime') AS published 
        FROM articles 
        WHERE cluster_id = ?
    `;
    db.all(query, [clusterId], (err, rows) => {
        if (err) {
            return next(err);
        }
        res.json(rows);
    });
});

// 4. GLOBAL ERROR HANDLER MIDDLEWARE
app.use((err, req, res, next) => {
    console.error("🚨 Server Error:", err.stack);
    res.status(500).json({ error: "Something went wrong on the server!" });
});

// SERVER START
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});