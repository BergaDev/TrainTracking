import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css';


import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';

interface CarSet {
  carNum: string;
  setNum: string;
}

interface Station {
  name: string;
}

interface OtherTripProps {
  setCarTimes: (times: number) => void;
  setSetTimes: (times: number) => void;
}

const OtherTrip: React.FC<OtherTripProps> = ({ setCarTimes, setSetTimes }) => {
  const [setCarQuery, setSetCarQuery] = useState('');
  const [originStationEntry, setOriginStationEntry] = useState('');
  const [destinationStationEntry, setDestinationStationEntry] = useState('');
  const [carSetResults, setCarSetResults] = useState<CarSet[]>([]);
  const [originStationResults, setOriginStationResults] = useState<Station[]>([]);
  const [destinationStationResults, setDestinationStationResults] = useState<Station[]>([]);
  const [date, setDate] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  //Need to set select options this way
  useEffect(() => {
    if (carSetResults.length > 0) {
      const firstResult = carSetResults[0];
      setSetCarQuery(`${firstResult.carNum}|${firstResult.setNum}`);
    }
  }, [carSetResults]);

  useEffect(() => {
    if (originStationResults.length > 0) {
      const firstResult = originStationResults[0];
      setOriginStationEntry(firstResult.name);
    }
  }, [originStationResults]);

  useEffect(() => {
    if (destinationStationResults.length > 0) {
      const firstResult = destinationStationResults[0];
      setDestinationStationEntry(firstResult.name);
    }
  }, [destinationStationResults]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/userData/newTrip', {
        userID: '707',
        setNum: setCarQuery,
        carNum: setCarQuery,
        date: date,
        dep: originStationEntry,
        des: destinationStationEntry
      });
      setHasSearched(false);
      setCarSetResults([]);
      setOriginStationResults([]);
      setDestinationStationResults([]);
      setSetCarQuery('');
      setOriginStationEntry('');
      setDestinationStationEntry('');
      setDate('');
      setCarTimes(response.data.carTimes);
      setSetTimes(response.data.setTimes);
      {/*
      //TODO: Add a message and clear the form
      */}

      document.getElementById('new-trip-container')?.setAttribute('style', 'display: none;');
      document.getElementById('results-container')?.setAttribute('style', 'display: block;');
      setTimeout(() => {
        window.location.reload();
      }, 1500); //Wait 1.5 to see message
    } catch (error) {
      console.error('Error submitting trip:', error);
    }
  };


  return (
    <Container maxWidth="md" id="new-trip-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Trips Outside Of Sydney Or Melbourne
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box component="form" sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm>
                    <TextField
                      fullWidth
                      label="Set or carriage Num"
                      value={setCarQuery}
                      onChange={(e) => setSetCarQuery(e.target.value)}
                      placeholder="XF2228"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Button
                      type="button"
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={() => setHasSearched(true)}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box component="form" sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm>
                    <TextField
                      fullWidth
                      label="Origin Station"
                      value={originStationEntry}
                      onChange={(e) => setOriginStationEntry(e.target.value)}
                      placeholder="Roma Street"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Button
                      type="button"
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={() => setHasSearched(true)}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box component="form" sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm>
                    <TextField
                      fullWidth
                      label="Destination Station"
                      value={destinationStationEntry}
                      onChange={(e) => setDestinationStationEntry(e.target.value)}
                      placeholder="Boggo Road"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Button
                      type="button"
                      variant="contained"
                      startIcon={<SearchIcon />}
                      onClick={() => setHasSearched(true)}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

          <Container id="selection-area" sx={{ display: hasSearched ? 'block' : 'none' }}>
            <Grid item xs={12}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Selected set and carriage"
                      value={setCarQuery}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Origin"
                      value={originStationEntry}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      label="Destination"
                      value={destinationStationEntry}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      required
                      type="datetime-local"
                      label="Date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      size="large"
                      endIcon={<SendIcon />}
                    >
                      Submit Trip
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
            </Container>
          </Grid>
        </Box>
      </Paper>
      {/* End form container */}
    </Container>
  );
};

export default OtherTrip;
