import { useState, useEffect, useRef } from 'react'
import { Container, Typography, Box, Paper } from '@mui/material'
import { styled } from '@mui/material/styles'
import './styles/globals.css'
import { api } from './services/api'
import gsap from 'gsap'
import Header from './components/header'
import NewTrip from './components/newTrip'
import Options from './components/options'
import ViewTrips from './components/viewTrips'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Settings from './components/settings'
import TrainSearch from './components/trainSearch'
import MelbourneTrip from './components/melbEntry'
import Challenges from './components/challenges'
import DateTrip from './components/dateTrip'

function App() {
  const [message, setMessage] = useState<string>('');
  const titleRef = useRef<HTMLHeadingElement>(null);
  const messageRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const data = await api.getWelcomeMessage();
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching message:', error);
        setMessage('Error connecting to the server');
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
        <Route path="/date-trip" element={<DateTrip />} />
      </Routes>
    </Router>
  );
}

export default App
