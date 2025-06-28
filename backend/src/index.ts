import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import statusRoutes from './routes/status';
import trainDataRoutes, { initializeDatabase as initializeTrainDatabase } from './routes/trainData';
import stationDataRoutes, { initializeDatabase as initializeStationDatabase } from './routes/stationData';
import userDataRoutes, { initializeDatabase as initializeUserData } from './routes/userData';
import challengeDataRoutes, { initializeDatabase as initializeChallengeDatabase } from './routes/challengeData';
import automatedChecksRoutes, { initializeDatabase as initializeAutomatedChecks } from './routes/automatedChecks';
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
const port = process.env.BACKEND_PORT;

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
app.use('/challengeData', challengeDataRoutes);
app.use('/automatedChecks', automatedChecksRoutes);

// Check function
async function triggerAutomatedChecks() {
  try {
    const baseUrl = `http://localhost:${port}`;
    const response = await fetch(`${baseUrl}/automatedChecks/stationChallenges/todo`);
    if (response.ok) {
      console.log('Automated checks completed successfully');
    } else {
      console.error('Automated checks failed:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error triggering automated checks:', error);
  }
}

// Initialize databases and start server
Promise.all([
  initializeTrainDatabase(),
  initializeStationDatabase(),
  initializeUserData(),
  initializeChallengeDatabase(),
  initializeAutomatedChecks()
])
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });

    setInterval(() => {
      console.log('Running automated checks');
      triggerAutomatedChecks();
    }, 1000 * 60 * 5); // Run every 5 minutes
  })
  .catch(error => {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  }); 