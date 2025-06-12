import { Box, Button, Container, Typography } from '@mui/material';
import { useState } from 'react';
import NewTrip from './newTrip';
import ViewTrips from './viewTrips';
import { useNavigate } from 'react-router-dom';

const Options: React.FC = () => {
  const [showNewTrip, setShowNewTrip] = useState(false);
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => setShowNewTrip(!showNewTrip)}
        >
          {showNewTrip ? 'Hide New Trip' : 'New Trip'}
        </Button>
      </Box>
      {showNewTrip && <NewTrip />}
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