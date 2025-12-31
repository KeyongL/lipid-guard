import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database connection configuration
const isProduction = process.env.NODE_ENV === 'production';
const connectionString = process.env.DATABASE_URL;

// Create connection pool with SSL config for production
const pool = new Pool({
  connectionString: connectionString,
  ssl: isProduction ? { rejectUnauthorized: false } : undefined,
  // Local environment fallback
  user: !connectionString ? process.env.DB_USER : undefined,
  host: !connectionString ? process.env.DB_HOST : undefined,
  password: !connectionString ? process.env.DB_PASSWORD : undefined,
  port: !connectionString ? process.env.DB_PORT : undefined,
  database: !connectionString ? process.env.DB_NAME : undefined
});

app.use(cors());
app.use(express.json());
// Serve static files from the public directory for development
app.use(express.static(path.join(__dirname, '../public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'LipidGuard API is running' });
});

// Food library endpoints
app.get('/api/foods', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM food_library');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching foods:', error);
    res.status(500).json({ error: 'Failed to fetch foods' });
  }
});

// Food search endpoint
app.get('/api/foods/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json([]);
    }
    
    const result = await pool.query(
      'SELECT * FROM food_library WHERE name ILIKE $1',
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error searching foods:', error);
    res.status(500).json({ error: 'Failed to search foods' });
  }
});

// Daily logs endpoints
app.get('/api/logs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM daily_logs ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Failed to fetch logs' });
  }
});

app.post('/api/logs', async (req, res) => {
  try {
    const { food_id, actual_fat } = req.body;
    const result = await pool.query(
      'INSERT INTO daily_logs (log_date, food_id, actual_fat) VALUES (DATE(NOW()), $1, $2) RETURNING *',
      [food_id, actual_fat]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating log:', error);
    res.status(500).json({ error: 'Failed to create log' });
  }
});

// Summary endpoint for today's total fat
app.get('/api/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT SUM(actual_fat) as total_fat
      FROM daily_logs 
      WHERE DATE(log_date) = DATE(NOW())
    `);
    res.json({
      total_fat: result.rows[0].total_fat || 0,
      daily_limit: 20
    });
  } catch (error) {
    console.error('Error fetching summary:', error);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Add new food
app.post('/api/foods', async (req, res) => {
  try {
    const { name, fat_per_100g, cholesterol_mg, risk_level } = req.body;
    const result = await pool.query(
      'INSERT INTO food_library (name, fat_per_100g, cholesterol_mg, risk_level) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, fat_per_100g, cholesterol_mg, risk_level]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding food:', error);
    res.status(500).json({ error: 'Failed to add food' });
  }
});

// Delete food
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // First delete related logs
    await pool.query('DELETE FROM daily_logs WHERE food_id = $1', [id]);
    // Then delete the food
    const result = await pool.query(
      'DELETE FROM food_library WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting food:', error);
    res.status(500).json({ error: 'Failed to delete food' });
  }
});

// Delete log entry
app.delete('/api/logs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM daily_logs WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Log not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error deleting log:', error);
    res.status(500).json({ error: 'Failed to delete log' });
  }
});

// Serve static files
if (process.env.NODE_ENV === 'production') {
  // In production, serve dist directory from the project root
  const distPath = path.join(__dirname, '../dist');
  console.log(`Serving static files from: ${distPath}`);
  app.use(express.static(distPath));
} else {
  // In development, serve public directory from the project root
  const publicPath = path.join(__dirname, '../public');
  console.log(`Serving static files from: ${publicPath}`);
  app.use(express.static(publicPath));
}

// Catch-all route for React Router (must be after all API routes)
app.get('*', (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // In production, serve index.html from dist
    const indexPath = path.join(__dirname, '../dist/index.html');
    res.sendFile(indexPath);
  } else {
    // In development, let Vite handle the routing
    res.status(404).send('Not Found');
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
