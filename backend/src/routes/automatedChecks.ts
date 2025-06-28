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

router.get('/stationChallenges/todo', async (req, res) => {
  try {
    console.log('Checking for station challenges');
    const [userRows] = await pool.query('SELECT userID FROM challenge_data WHERE status = "todo" AND challengeType = "stationVisit"');
    console.log('User rows:', userRows);

    for (const row of userRows as any[]) {
      console.log('Checking user:', row.userID);
      const userID = row.userID;
      const [challengeRows] = await pool.query('SELECT * FROM challenge_data WHERE userID = ? AND challengeType = "stationVisit" AND status = "todo"', [userID]);
      for (const challengeRow of challengeRows as any[]) {
        console.log('Checking challenge:', challengeRow.challengeID);
        console.log('Challenge data type:', typeof challengeRow.challengeData);
        console.log('Challenge data:', challengeRow.challengeData);
        
        let getObj;
        try {
          // Handle both string and object cases
          if (typeof challengeRow.challengeData === 'string') {
            getObj = JSON.parse(challengeRow.challengeData);
          } else {
            getObj = challengeRow.challengeData;
          }
        } catch (parseError) {
          console.error('Error parsing challenge data:', parseError);
          console.log('Raw challenge data:', challengeRow.challengeData);
        }
        
        const stationName = getObj.isStationName;
        console.log('Station name:', stationName);
        const [stationRows] = await pool.query('SELECT * FROM userData WHERE userID = ? AND (des = ? OR dep = ?) AND date >= ?', [userID, stationName, stationName, challengeRow.startDate]);
        if (Array.isArray(stationRows) && stationRows.length > 0) {
          console.log(stationRows);
          const tripDate = (stationRows[0] as any).date;
          const [updateRows] = await pool.query('UPDATE challenge_data SET status = "done", doneDate = ? WHERE challengeID = ?', [tripDate, challengeRow.challengeID]);
          console.log(updateRows);
          console.log('Station found');
        } else {
          console.log('Station not found');
        }
      }
    }

    res.json(userRows);
  } catch (error: any) {
    console.error('Error fetching station challenges:', {
      message: error.message
    });
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
