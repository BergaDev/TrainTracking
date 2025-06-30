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

router.post('/challenge/new/:userID', async (req, res) => {
    try {
        const { userID, challengeTitle, startDate, status = "todo", challengeData, challengeType } = req.body;
        const [rows] = await pool.query('INSERT INTO challenge_data (userID, challengeTitle, startDate, status, challengeData, challengeType) VALUES (?, ?, ?, ?, ?, ?)', [userID, challengeTitle, startDate, status, challengeData, challengeType]);
        res.json(rows);
    } catch (error: any) {
        console.error('Error inserting challenge:', {
            message: error.message
        });
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:userID', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM challenge_data where userID = ?', [req.params.userID]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching challenges:', {
      code: error.code,
      errno: error.errno,
      sqlState: error.sqlState,
      sqlMessage: error.sqlMessage,
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/challenge/todo/:userID', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM challenge_data WHERE userID = ? AND status = "todo"', [req.params.userID]);
    res.json(rows);
  } catch (error: any) {
    console.error('Error fetching todo:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/challenge/done/:userID', async (req, res) => {
  try {
    let timeTaken = 0;
    const [rows] = await pool.query('SELECT * FROM challenge_data WHERE userID = ? AND status = "done"', [req.params.userID]);
    for (const challengeRow of rows as any []){
      //Todo: Calc time between here
      //Turn date into a continuous string then subtract?
      if (challengeRow.timeTaken == null) {
      const startDate = new Date(challengeRow.startDate);
      const endDate = new Date(challengeRow.doneDate);
      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          timeTaken = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60)); // minutes
        }
        console.log('Time taken (minutes): ' + timeTaken);
        await pool.query('UPDATE challenge_data SET timeTaken = ? WHERE challengeID = ? AND status = "done"', [timeTaken, challengeRow.challengeID]);
      }
    }
    const [rows2] = await pool.query('SELECT * FROM challenge_data WHERE userID = ? AND status = "done"', [req.params.userID]);
    console.log(rows2);
    res.json(rows2);
  } catch (error: any) {
    console.error('Error fetching done:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
