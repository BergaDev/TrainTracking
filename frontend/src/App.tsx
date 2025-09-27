import { useEffect } from 'react'
import './styles/globals.css'
import { api } from './services/api'
import Options from './components/options'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Settings from './components/settings'
import TrainSearch from './components/trainSearch'
import ViewTrips from './components/viewTrips'
import Challenges from './components/challenges'

function App() {

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await api.getWelcomeMessage();
        console.log('Welcome message:', data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Options />} />
        <Route path="/view-trips" element={<ViewTrips />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/train-search" element={<TrainSearch />} />
        <Route path="/challenges" element={<Challenges />} />
      </Routes>
    </Router>
  );
}

export default App
