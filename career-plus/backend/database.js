const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// When deployed on Cloud Run with a GCS FUSE mount, the volume is typically mounted at /mnt/gcs
// For local testing, we fallback to a local file in the backend directory.
const MOUNT_DIR = process.env.NODE_ENV === 'production' ? '/mnt/gcs' : path.join(__dirname, 'local_db');

// Ensure the local directory exists if running locally
if (process.env.NODE_ENV !== 'production' && !fs.existsSync(MOUNT_DIR)) {
  fs.mkdirSync(MOUNT_DIR, { recursive: true });
}

const dbPath = path.join(MOUNT_DIR, 'database.sqlite');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log(`Connected to the SQLite database at ${dbPath}`);
    // Initialize standard tables
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

module.exports = db;
