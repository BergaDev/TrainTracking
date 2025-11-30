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

router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM car_sets');
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching car sets:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search/train/:query', async (req, res) => {
  try {
    let multipleTables = [];
    const [rows] = await pool.query('SELECT * FROM car_sets WHERE SetNum LIKE ? OR CarNum LIKE ?', [`%${req.params.query}%`, `%${req.params.query}%`]);
    multipleTables.push(...rows as any[]);
    const [rows2] = await pool.query('SELECT * FROM melb_car_sets WHERE SetNum LIKE ? OR CarNum LIKE ?', [`%${req.params.query}%`, `%${req.params.query}%`]);
    multipleTables.push(...rows2 as any[]);
    res.json(multipleTables);
  } catch (error: any) {
    console.error('Error fetching car sets:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/search/train/melbourne/:query', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM melb_car_sets WHERE SetNum LIKE ? OR CarNum LIKE ?', [`%${req.params.query}%`, `%${req.params.query}%`]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching car sets:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
