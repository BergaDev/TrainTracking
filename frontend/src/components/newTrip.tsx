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

const NewTrip: React.FC = () => {
  const [setCarQuery, setSetCarQuery] = useState('');
  const [originStationQuery, setOriginStationQuery] = useState('');
  const [destinationStationQuery, setDestinationStationQuery] = useState('');
  const [carSetResults, setCarSetResults] = useState<CarSet[]>([]);
  const [originStationResults, setOriginStationResults] = useState<Station[]>([]);
  const [destinationStationResults, setDestinationStationResults] = useState<Station[]>([]);
  const [selectedCarSet, setSelectedCarSet] = useState<string>('');
  const [departure, setDeparture] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);

  //Need to set select options this way
  useEffect(() => {
    if (carSetResults.length > 0) {
      const firstResult = carSetResults[0];
      setSelectedCarSet(`${firstResult.carNum}|${firstResult.setNum}`);
    }
  }, [carSetResults]);

  useEffect(() => {
    if (originStationResults.length > 0) {
      const firstResult = originStationResults[0];
      setDeparture(firstResult.name);
    }
  }, [originStationResults]);

  useEffect(() => {
    if (destinationStationResults.length > 0) {
      const firstResult = destinationStationResults[0];
      setDestination(firstResult.name);
    }
  }, [destinationStationResults]);

  const handleSetCarSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/trainData/search/train/${setCarQuery}`);
      setCarSetResults(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching for car sets:', error);
    }
  };

  const handleOriginStationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/stationData/search/station/${originStationQuery}`);
      setOriginStationResults(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching for stations:', error);
    }
  };

  const handleDestinationStationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/stationData/search/station/${destinationStationQuery}`);
      setDestinationStationResults(response.data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error searching for stations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/userData/newTrip', {
        userID: '707',
        setNum: selectedCarSet.split('|')[1],
        carNum: selectedCarSet.split('|')[0],
        date: date,
        dep: departure,
        des: destination
      });
      alert('Trip submitted successfully');
      setHasSearched(false);
      setCarSetResults([]);
      setOriginStationResults([]);
      setDestinationStationResults([]);
      setSelectedCarSet('');
      setDeparture('');
      setDestination('');
      setDate('');
      window.location.reload();
      {/*
      //TODO: Add a message and clear the form
      */}
    } catch (error) {
      console.error('Error submitting trip:', error);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    switch (name) {
      case 'selectedCarSet':
        setSelectedCarSet(value);
        break;
      case 'departure':
        setDeparture(value);
        break;
      case 'destination':
        setDestination(value);
        break;
    }
  };

  const groupedOriginStations = originStationResults.reduce((acc, station) => {
    const firstLetter = station.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(station);
    return acc;
  }, {} as Record<string, Station[]>);

  const groupedDestinationStations = destinationStationResults.reduce((acc, station) => {
    const firstLetter = station.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(station);
    return acc;
  }, {} as Record<string, Station[]>);

  return (
    <Container maxWidth="md" id="new-trip-container">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          New Trip Entry
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box component="form" onSubmit={handleSetCarSearch} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm>
                    <TextField
                      fullWidth
                      label="Set or carriage Num"
                      value={setCarQuery}
                      onChange={(e) => setSetCarQuery(e.target.value)}
                      placeholder="A73"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SearchIcon />}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box component="form" onSubmit={handleOriginStationSearch} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm>
                    <TextField
                      fullWidth
                      label="Station"
                      value={originStationQuery}
                      onChange={(e) => setOriginStationQuery(e.target.value)}
                      placeholder="Thirroul"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SearchIcon />}
                    >
                      Search
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box component="form" onSubmit={handleDestinationStationSearch} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm>
                    <TextField
                      fullWidth
                      label="Station"
                      value={destinationStationQuery}
                      onChange={(e) => setDestinationStationQuery(e.target.value)}
                      placeholder="Thirroul"
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm="auto">
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SearchIcon />}
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
                    <FormControl fullWidth required>
                      <InputLabel>Select the set and carriage</InputLabel>
                      <Select
                        name="selectedCarSet"
                        value={selectedCarSet}
                        onChange={handleSelectChange}
                        label="Select the set and carriage"
                      >
                        {carSetResults.map((result) => (
                          <MenuItem
                            key={`${result.carNum}-${result.setNum}`}
                            value={`${result.carNum}|${result.setNum}`}
                          >
                            Carriage: {result.carNum} - Set: {result.setNum}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Origin</InputLabel>
                      <Select
                        name="departure"
                        value={departure}
                        onChange={handleSelectChange}
                        label="Origin"
                      >
                        {Object.entries(groupedOriginStations).map(([letter, stations]) => [
                          <MenuItem key={letter} disabled>
                            {letter}
                          </MenuItem>,
                          ...stations.map((station) => (
                            <MenuItem 
                              key={station.name} 
                              value={station.name}
                            >
                              {station.name}
                            </MenuItem>
                          ))
                        ])}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Destination</InputLabel>
                      <Select
                        name="destination"
                        value={destination}
                        onChange={handleSelectChange}
                        label="Destination"
                      >
                        {Object.entries(groupedDestinationStations).map(([letter, stations]) => [
                          <MenuItem key={letter} disabled>
                            {letter}
                          </MenuItem>,
                          ...stations.map((station) => (
                            <MenuItem 
                              key={station.name} 
                              value={station.name}
                            >
                              {station.name}
                            </MenuItem>
                          ))
                        ])}
                      </Select>
                    </FormControl>
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

export default NewTrip;
