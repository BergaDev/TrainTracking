import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import statusRoutes from './routes/status';
import trainDataRoutes, { initializeDatabase as initializeTrainDatabase } from './routes/trainData';
import stationDataRoutes, { initializeDatabase as initializeStationDatabase } from './routes/stationData';
import userDataRoutes, { initializeDatabase as initializeUserData } from './routes/userData';
// Load both .env and .db.env files
dotenv.config();
dotenv.config({ path: '.db.env' });

// Debug log to verify environment variables
console.log('Environment variables loaded:', {
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_NAME: process.env.DB_NAME
});

const app = express();
const port = 3020;

// Middleware
app.use(cors({
  origin: '*',
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'API is up' });
});

app.use('/status', statusRoutes);
app.use('/trainData', trainDataRoutes);
app.use('/stationData', stationDataRoutes);
app.use('/userData', userDataRoutes);
// Initialize databases and start server
Promise.all([
  initializeTrainDatabase(),
  initializeStationDatabase(),
  initializeUserData()
])
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }); 