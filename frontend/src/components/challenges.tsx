import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/globals.css';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Train as TrainIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as ChallengesIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import type { SelectChangeEvent } from '@mui/material';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme, open }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${drawerWidth}px`,
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  }),
}));

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<{
  open?: boolean;
}>(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

interface Challenge {
  id: number;
  userID: string;
  challengeTitle: string;
  startDate: string;
  doneDate: string;
  status: 'todo' | 'done';
  challengeData?: string;
}

interface Station {
  name: string;
}

const Challenges: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [todoChallenges, setTodoChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Challenge[]>([]);
  const [newChallengeDialog, setNewChallengeDialog] = useState(false);
  const [challengeTitle, setChallengeTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [challengeData, setChallengeData] = useState('');
  const [challengeType, setChallengeType] = useState('');
  const [stationQuery, setStationQuery] = useState('');
  const [stationResults, setStationResults] = useState<Station[]>([]);
  const [selectedStation, setSelectedStation] = useState('');
  const [hasSearchedStations, setHasSearchedStations] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  const fetchChallenges = async () => {
    try {
      const [todoResponse, completedResponse] = await Promise.all([
        axios.get('/api/challengeData/challenge/todo/707'),
        axios.get('/api/challengeData/challenge/done/707')
      ]);
      setTodoChallenges(todoResponse.data);
      setCompletedChallenges(completedResponse.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleCreateChallenge = async () => {
    console.log('handleCreateChallenge called');
    console.log('Form data:', { challengeTitle, startDate, challengeData, challengeType });
    
    try {
      const response = await axios.post('/api/challengeData/challenge/new/707', {
        userID: '707',
        challengeTitle,
        startDate,
        status: 'todo',
        challengeData,
        challengeType
      });
      console.log('Challenge created successfully:', response.data);
      
      setChallengeTitle('');
      setStartDate('');
      setChallengeData('');
      setChallengeType('');
      setStationQuery('');
      setStationResults([]);
      setSelectedStation('');
      setHasSearchedStations(false);
      fetchChallenges();
    } catch (error) {
      console.error('Error creating challenge:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleStationSearch = async () => {
    try {
      const response = await axios.get(`/api/stationData/search/station/combinedStates/${stationQuery}`);
      setStationResults(response.data);
      setHasSearchedStations(true);
    } catch (error) {
      console.error('Error searching for stations:', error);
    }
  };

  const handleStationSelect = (event: SelectChangeEvent) => {
    const stationName = event.target.value;
    setSelectedStation(stationName);
    setChallengeData(JSON.stringify({ isStationName: stationName }));
  };

  const handleChallengeTypeChange = (event: SelectChangeEvent) => {
    const type = event.target.value;
    setChallengeType(type);
    if (type !== 'stationVisit') {
      setSelectedStation('');
      setChallengeData('');
      setStationResults([]);
      setHasSearchedStations(false);
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
    <Box sx={{ display: 'flex', backgroundColor: '#2D9DFF', minHeight: '100vh' }}>
      <AppBarStyled position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Challenges
          </Typography>
        </Toolbar>
      </AppBarStyled>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="New Trip" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/train-search')}>
              <ListItemIcon>
                <TrainIcon />
              </ListItemIcon>
              <ListItemText primary="Trains" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/challenges')}>
              <ListItemIcon>
                <ChallengesIcon />
              </ListItemIcon>
              <ListItemText primary="Challenges" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => handleNavigation('/settings')}>
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

        {/* Form */}
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                Create New Challenge
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={(e) => { 
              e.preventDefault(); 
              e.stopPropagation();
              handleCreateChallenge(); 
            }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Challenge Title"
                    value={challengeTitle}
                    onChange={(e) => setChallengeTitle(e.target.value)}
                    placeholder="e.g., Ride all V-Set trains"
                    required
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <Select
                    fullWidth
                    label="Challenge Type"
                    value={challengeType}
                    onChange={handleChallengeTypeChange}
                    required
                  >
                    <MenuItem value="stationVisit">Visit Station</MenuItem>
                  </Select>
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    required
                  />
                </Grid>
                
                {/* Station Search*/}
                {challengeType === 'stationVisit' && (
                  <>
                    <Grid item xs={12}>
                      <Box sx={{ mb: 3 }}>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm>
                            <TextField
                              fullWidth
                              label="Search for Station"
                              value={stationQuery}
                              onChange={(e) => setStationQuery(e.target.value)}
                              placeholder="e.g., Thirroul"
                              required
                            />
                          </Grid>
                          <Grid item xs={12} sm="auto">
                            <Button
                              variant="contained"
                              startIcon={<SearchIcon />}
                              onClick={handleStationSearch}
                              disabled={!stationQuery.trim()}
                            >
                              Search
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>

                {/* Station Selection */}
                    {hasSearchedStations && (
                      <Grid item xs={12}>
                        <FormControl fullWidth required>
                          <InputLabel>Select Station</InputLabel>
                          <Select
                            value={selectedStation}
                            onChange={handleStationSelect}
                            label="Select Station"
                          >
                            {Object.entries(groupedStations).map(([letter, stations]) => [
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
                    )}
                  </>
                )}

                {/* More data, should probably get rid of this */}
                {challengeType !== 'stationVisit' && (
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Additional Data"
                      value={challengeData}
                      onChange={(e) => setChallengeData(e.target.value)}
                      placeholder="Notes"
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={handleCreateChallenge}
                      disabled={!challengeTitle || !startDate || (challengeType === 'stationVisit' && !selectedStation)}
                      sx={{ backgroundColor: '#2D9DFF' }}
                    >
                      Create Challenge
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Paper>


          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScheduleIcon sx={{ mr: 1, color: '#FF9800' }} />
                  <Typography variant="h5" component="h3" fontWeight={900}>
                    To-Do Challenges
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Start Date</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {todoChallenges.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell>{challenge.challengeTitle}</TableCell>
                          <TableCell>{formatDate(challenge.startDate)}</TableCell>
                          <TableCell>
                            <Chip 
                              label="To-Do" 
                              color="warning" 
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {todoChallenges.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No Challenges in Progress
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <CheckCircleIcon sx={{ mr: 1, color: '#4CAF50' }} />
                  <Typography variant="h5" component="h3" fontWeight={900}>
                    Completed Challenges
                  </Typography>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>Finished Date</TableCell>
                        <TableCell>Time Taken</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {completedChallenges.map((challenge) => (
                        <TableRow key={challenge.id}>
                          <TableCell>{challenge.challengeTitle}</TableCell>
                          <TableCell>{formatDate(challenge.doneDate)}</TableCell>
                          <TableCell>
                            {challenge.timeTaken < 60 
                              ? `${challenge.timeTaken} minutes`
                              : challenge.timeTaken < 1440
                                ? `${(challenge.timeTaken / 60).toFixed(1)} hours` 
                                : `${(challenge.timeTaken / 1440).toFixed(1)} days`}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label="Completed" 
                              color="success" 
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {completedChallenges.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={3} align="center">
                            No Completed Challenges
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Main>


    </Box>
  );
};

export default Challenges;
