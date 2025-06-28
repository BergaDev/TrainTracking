import { Router } from 'express';
import mysql from 'mysql2/promise';

const router = Router();

let pool: mysql.Pool;

export function initializeDatabase() {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 10000
  });
  return pool.getConnection()
    .then(connection => {
      console.log('Successfully connected to database');
      connection.release();
    })
    .catch(err => {
      console.error('Error connecting to the database:', {
        code: err.code,
        errno: err.errno,
        sqlState: err.sqlState,
        sqlMessage: err.sqlMessage,
        message: err.message
      });
      throw err;
    });
}

router.get('/search/station/:query', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name FROM stations WHERE name LIKE ?', [`%${req.params.query}%`]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching stations:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search/station/melbourne/:query', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name FROM melb_stations WHERE name LIKE ?', [`%${req.params.query}%`]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching stations:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search/station/combinedStates/:query', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT name FROM stations WHERE name LIKE ?', [`%${req.params.query}%`]) as [any[], any];
    const [rows2] = await pool.query('SELECT name FROM melb_stations WHERE name LIKE ?', [`%${req.params.query}%`]) as [any[], any];
    const combinedStates = [...rows, ...rows2];
    res.json(combinedStates);
  } catch (error: any) {
    console.error('Error fetching stations:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
