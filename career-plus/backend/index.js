const express = require('express');
const cors = require('cors');
const db = require('./database');
const logger = require('./logger');

const app = express();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Middleware to log all incoming requests
app.use((req, res, next) => {
  logger.info(`Incoming Request: ${req.method} ${req.url}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  next();
});

// Health check endpoint (Required for Cloud Run)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Example API: Get all users from SQLite
app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) {
      logger.error('Error fetching users from database', { error: err.message });
      return res.status(500).json({ error: err.message });
    }
    res.json({ users: rows });
  });
});

// Example API: Add a user to SQLite
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    logger.warn('User creation failed due to missing fields', { body: req.body });
    return res.status(400).json({ error: 'Name and email are required' });
  }

  const sql = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.run(sql, [name, email], function(err) {
    if (err) {
      logger.error('Error inserting user', { error: err.message, email });
      return res.status(500).json({ error: err.message });
    }
    
    logger.info('Successfully created new user', { userId: this.lastID, email });
    res.status(201).json({ 
      message: 'User created successfully', 
      user: { id: this.lastID, name, email } 
    });
  });
});

app.listen(port, () => {
  logger.info(`Backend API listening on port ${port}`);
});
