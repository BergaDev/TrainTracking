import React, { useState } from 'react';
import axios from 'axios';
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
  const [stationQuery, setStationQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CarSet[]>([]);
  const [stationResults, setStationResults] = useState<Station[]>([]);
  const [selectedCarSet, setSelectedCarSet] = useState('');
  const [departure, setDeparture] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const handleSetCarSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/search/carset', { query: setCarQuery });
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error searching for car sets:', error);
    }
  };

  const handleStationSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/search/station', { query: stationQuery });
      setStationResults(response.data);
    } catch (error) {
      console.error('Error searching for stations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/trips', {
        carSet: selectedCarSet,
        departure,
        destination,
        date
      });
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

  const groupedStations = stationResults.reduce((acc, station) => {
    const firstLetter = station.name.charAt(0).toUpperCase();
    if (!acc[firstLetter]) {
      acc[firstLetter] = [];
    }
    acc[firstLetter].push(station);
    return acc;
  }, {} as Record<string, Station[]>);

  return (
    <Container maxWidth="md">
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
              <Box component="form" onSubmit={handleStationSearch} sx={{ mb: 3 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm>
                    <TextField
                      fullWidth
                      label="Station"
                      value={stationQuery}
                      onChange={(e) => setStationQuery(e.target.value)}
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
                        {searchResults.map((result) => (
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
                        {Object.entries(groupedStations).map(([letter, stations]) => [
                          <MenuItem key={letter} disabled>
                            {letter}
                          </MenuItem>,
                          ...stations.map((station) => (
                            <MenuItem key={station.name} value={station.name}>
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
                        {Object.entries(groupedStations).map(([letter, stations]) => [
                          <MenuItem key={letter} disabled>
                            {letter}
                          </MenuItem>,
                          ...stations.map((station) => (
                            <MenuItem key={station.name} value={station.name}>
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
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewTrip;
