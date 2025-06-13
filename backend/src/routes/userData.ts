import { Router } from 'express';
import mysql from 'mysql2/promise';
import axios from 'axios';
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
    const [rows] = await pool.query('SELECT * FROM user_data');
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching user data:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/allTrips/:userID', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM userData WHERE userID = ? ORDER BY `userData`.`date` DESC', [req.params.userID]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching all trips:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tripsStats/allTime/:userID', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as totalTrips FROM userData WHERE userID = ?', [req.params.userID]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching all trips:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tripsStats/pastMonth/:userID', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT COUNT(*) as totalTrips FROM userData WHERE userID = ? AND YEAR(date) = YEAR(CURRENT_DATE()) AND MONTH(date) = MONTH(CURRENT_DATE())', [req.params.userID]);
      res.json(rows);
    } catch (error: any) {
      console.error('Error fetching all trips:', {
        message: error.message
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/tripsStats/commonSet/:userID', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT setNum, COUNT(*) as frequentSets FROM userData WHERE userID = ? AND setNum IS NOT NULL AND setNum != "Metro" GROUP BY setNum ORDER BY frequentSets DESC LIMIT 1', [req.params.userID]);
      res.json(rows);
    } catch (error: any) {
      console.error('Error fetching all trips:', {
        message: error.message
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/tripsStats/commonCar/:userID', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT carNum, COUNT(*) as frequentCars FROM userData WHERE userID = ? AND carNum IS NOT NULL AND carNum != "Metro" GROUP BY carNum ORDER BY frequentCars DESC LIMIT 1', [req.params.userID]);
      res.json(rows);
    } catch (error: any) {
      console.error('Error fetching all trips:', {
        message: error.message
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/tripsStats/monthGroup/:userID', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT DATE_FORMAT(date, "%Y-%m") as month, COUNT(*) as trips FROM userData WHERE userID = ? GROUP BY month ORDER BY month DESC', [req.params.userID]);
      res.json(rows);
    } catch (error: any) {
      console.error('Error fetching all trips:', {
        message: error.message
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/tripsStats/oftenStation/:userID', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT dep, COUNT(*) as frequentStations FROM userData WHERE userID = ? AND dep != "Bellambi" GROUP BY dep ORDER BY frequentStations DESC LIMIT 1', [req.params.userID]);
      res.json(rows);
    } catch (error: any) {
      console.error('Error fetching all trips:', {
        message: error.message
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/trainStats/timesCar/:userID/:carNum', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT carNum, COUNT(*) as frequency FROM userData WHERE userID = ? AND carNum = ? GROUP BY carNum ORDER BY frequency DESC LIMIT 1', [req.params.userID, req.params.carNum]);
      res.json(rows);
    } catch (error: any) {
      console.error('Error fetching all trips:', {
        message: error.message
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  router.get('/trainStats/timesSet/:userID/:setNum', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT setNum, COUNT(*) as frequency FROM userData WHERE userID = ? AND setNum = ? GROUP BY setNum ORDER BY frequency DESC LIMIT 1', [req.params.userID, req.params.setNum]);
      res.json(rows);
    } catch (error: any) {
      console.error('Error fetching all trips:', {
        message: error.message
      });
      res.status(500).json({ error: 'Internal server error' });
    }
  });
    /*
router.get('/search/train/:query', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM car_sets WHERE SetNum = ? OR CarNum = ?', [req.params.query, req.params.query]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching car sets:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});
*/

router.post('/newTrip', async (req, res) => {
    try {
        const { userID, setNum, carNum, date, dep, des } = req.body;
        const subID = (Math.floor(Math.random() * 1000000));
        const [rows] = await pool.query('INSERT INTO userData (userID, setNum, carNum, date, subID, dep, des) VALUES (?, ?, ?, ?, ?, ?, ?)', [userID, setNum, carNum, date, subID, dep, des]);

        const carTimes = await axios.get('http://localhost:' + process.env.BACKEND_PORT + '/userData/trainStats/timesCar/' + userID + '/' + carNum);
        const setTimes = await axios.get('http://localhost:' + process.env.BACKEND_PORT + '/userData/trainStats/timesSet/' + userID + '/' + setNum);
        res.json({
            carTimes: (carTimes.data as any[])[0]?.frequency ?? 0,
            setTimes: (setTimes.data as any[])[0]?.frequency ?? 0
        });
    } catch (error: any) {
        console.error('Error inserting user data:', {
            message: error.message
        });
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
