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

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

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
      <Box
        sx={{
          minHeight: '100vh',
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Header />
        <Routes>
          <Route
            path="/"
            element={
              <Box
                sx={{
                  minHeight: '100vh',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Typography
                  ref={titleRef}
                  variant="h1"
                  component="h1"
                  sx={{
                    color: '#FFD600',
                    fontSize: { xs: '2.5rem', sm: '4rem', md: '6rem' },
                    fontWeight: 700,
                    textShadow: '2px 2px 8px #0008',
                    mb: 4,
                  }}
                >
                  Train Tracking
                </Typography>
                <Typography
                  ref={messageRef}
                  variant="h4"
                  component="p"
                  color="text.secondary"
                >
                  {message}
                </Typography>
                <Options />
              </Box>
            }
          />
          <Route path="/view-trips" element={<ViewTrips />} />
        </Routes>
      </Box>
    </Router>
  );
}

export default App
