const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const { pool, initDb } = require('./db');
const redis = require('./cache');
const client = require('prom-client');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Initialize Database
initDb();

// ------------------------------------------------------------------
// PROMETHEUS METRICS SETUP
// ------------------------------------------------------------------
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10]
});

app.use((req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on('finish', () => {
    end({ 
      route: req.route ? req.route.path : req.path, 
      code: res.statusCode, 
      method: req.method 
    });
  });
  next();
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
// ------------------------------------------------------------------

// 1. Health check endpoint (MUST be before generic routes)
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// 2. POST /shorten - Create a short URL
app.post('/shorten', async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const shortCode = nanoid(7);

    // Save to PostgreSQL
    await pool.query(
      'INSERT INTO urls (long_url, short_code) VALUES ($1, $2)',
      [longUrl, shortCode]
    );

    // Save to Redis
    await redis.set(shortCode, longUrl, 'EX', 3600 * 24);

    res.json({
      longUrl,
      shortUrl: `http://localhost:${PORT}/${shortCode}`,
      shortCode,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. GET /:shortCode - Redirect to long URL
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  try {
    // 1. Try to get from Redis
    let longUrl = await redis.get(shortCode);

    if (longUrl) {
      console.log('Cache hit');
      return res.redirect(longUrl);
    }

    // 2. If not in Redis, get from PostgreSQL
    console.log('Cache miss');
    const result = await pool.query(
      'SELECT long_url FROM urls WHERE short_code = $1',
      [shortCode]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'URL not found' });
    }

    longUrl = result.rows[0].long_url;

    // 3. Backfill Redis
    await redis.set(shortCode, longUrl, 'EX', 3600 * 24);

    res.redirect(longUrl);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
