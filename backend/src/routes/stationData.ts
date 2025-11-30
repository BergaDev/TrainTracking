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
    console.log('Query:', req.params.query);
    let multipleTables = [];
    const [rows] = await pool.query('SELECT stop_name FROM nswstops WHERE stop_name LIKE ?', [`%${req.params.query}%`]);
    multipleTables.push(...rows as any[]);
    const [rows2] = await pool.query('SELECT stop_name FROM vicmetrostops WHERE stop_name LIKE ?', [`%${req.params.query}%`]);
    multipleTables.push(...rows2 as any[]);
    const [rows3] = await pool.query('SELECT stop_name FROM vicregionalstops WHERE stop_name LIKE ?', [`%${req.params.query}%`]);
    multipleTables.push(...rows3 as any[]);
    const [rows4] = await pool.query('SELECT stop_name FROM victramstops WHERE stop_name LIKE ?', [`%${req.params.query}%`]);
    multipleTables.push(...rows4 as any[]);
    console.log('Rows:', multipleTables);
    res.json(multipleTables);
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

router.get('/search/station/gpsLocation/:lat/:lng', async (req, res) => {
  try {
    const lat = parseFloat(req.params.lat);
    const long = parseFloat(req.params.lng);
    if (isNaN(lat) || isNaN(long)) {
      return res.status(400).json({ error: 'Invalid lat or long' });
    }
    let multipleTables = [];
    const [rows] = await pool.query(
      `SELECT 
        *,
        ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) AS distance
      FROM nswstops 
      WHERE ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) <= 300
      ORDER BY distance`,
      [long, lat, long, lat]
    );
    multipleTables.push(...rows as any[]);
    const [rows2] = await pool.query(
      `SELECT 
        *,
        ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) AS distance
      FROM vicmetrostops 
      WHERE ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) <= 300
      ORDER BY distance`,
      [long, lat, long, lat]
    );
    multipleTables.push(...rows2 as any[]);
    const [rows3] = await pool.query(
      `SELECT 
        *,
        ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) AS distance
      FROM vicregionalstops 
      WHERE ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) <= 300
      ORDER BY distance`,
      [long, lat, long, lat]
    );
    multipleTables.push(...rows3 as any[]);
    const [rows4] = await pool.query(
      `SELECT 
        *,
        ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) AS distance
      FROM victramstops 
      WHERE ST_Distance_Sphere(ST_SRID(POINT(?, ?), 4326), ST_SRID(location, 4326)) <= 300
      ORDER BY distance`,
      [long, lat, long, lat]
    );
    multipleTables.push(...rows4 as any[]);
    console.log('Rows:', multipleTables);
    res.json(multipleTables);
  } catch (error: any) {
    console.error('Error fetching stations:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
