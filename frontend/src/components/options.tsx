import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import NewTrip from './newTrip';
import ViewTrips from './viewTrips';
import { useNavigate } from 'react-router-dom';

const Options: React.FC = () => {
  const [showNewTrip, setShowNewTrip] = useState(false);
  const navigate = useNavigate();
  const [carTimes, setCarTimes] = useState(0);
  const [setTimes, setSetTimes] = useState(0);

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4, ml: 2, position: 'absolute', top: 0, left: 0}}>
        <Typography variant="h6" component="h6">
          <a href="https://www.bergamini.au/" style={{ textDecoration: 'none', color: '#FFFF00', fontWeight: 900, fontSize: '2rem'}}>Matthew Bergamini</a>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h1" component="h1">
          Train Tracking
        </Typography>
      </Box>

      <Box sx={{ display: 'none', justifyContent: 'center', mt: 4, color: '#FFFF00', fontWeight: 900, fontSize: '2rem'}} id="results-container">
        <Typography variant="h6" component="h6">
          <p>You've ridden this set {setTimes} times before and the car {carTimes} times before</p>
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowNewTrip(!showNewTrip)}
        >
          {showNewTrip ? 'Hide New Trip' : 'New Trip'}
        </Button>
      </Box>
      {showNewTrip && <NewTrip setCarTimes={setCarTimes} setSetTimes={setSetTimes} />}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate('/view-trips')}
        >
          View Trips
        </Button>
      </Box>
    </Container>
  );
};

export default Options;