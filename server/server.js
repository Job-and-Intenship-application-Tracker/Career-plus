const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Ensure database directory exists
const dbDir = process.env.DATA_DIR || path.join(__dirname, '../data');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'careerplus.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening SQLite database:', err.message);
  } else {
    console.log(`Connected to SQLite database at: ${dbPath}`);
    initDb();
  }
});

function initDb() {
  db.serialize(() => {
    // Applications table
    db.run(`
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        user_key TEXT,
        company TEXT,
        position TEXT,
        status TEXT,
        location TEXT,
        salary TEXT,
        appliedDate TEXT,
        notes TEXT,
        priority TEXT,
        contactPerson TEXT,
        jobUrl TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Resumes table
    db.run(`
      CREATE TABLE IF NOT EXISTS resumes (
        id TEXT PRIMARY KEY,
        user_key TEXT,
        name TEXT,
        size INTEGER,
        type TEXT,
        data TEXT,
        uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('SQLite database tables initialized successfully!');
  });
}

// ----------------------------------------------------
// REST API ROUTES
// ----------------------------------------------------

// GET /api/applications
app.get('/api/applications', (req, res) => {
  const userKey = req.query.userKey || 'default';
  db.all('SELECT * FROM applications WHERE user_key = ? OR user_key = "default"', [userKey], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/applications
app.post('/api/applications', (req, res) => {
  const job = req.body;
  const id = job.id || `job_${Date.now()}`;
  const userKey = job.userKey || 'default';

  const stmt = db.prepare(`
    INSERT OR REPLACE INTO applications 
    (id, user_key, company, position, status, location, salary, appliedDate, notes, priority, contactPerson, jobUrl)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  stmt.run(
    id,
    userKey,
    job.company || '',
    job.position || '',
    job.status || 'applied',
    job.location || '',
    job.salary || '',
    job.appliedDate || new Date().toISOString(),
    job.notes || '',
    job.priority || 'medium',
    job.contactPerson || '',
    job.jobUrl || '',
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true, id, ...job });
    }
  );
  stmt.finalize();
});

// DELETE /api/applications/:id
app.delete('/api/applications/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM applications WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, deleted: this.changes });
  });
});

// Healthcheck endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'UP', database: 'SQLite', timestamp: new Date() });
});

// Serve Vite Production Build static files
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA Fallback
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`CareerPlus Full-Stack Server running on port ${PORT}`);
});
