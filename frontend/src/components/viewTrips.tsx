import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Container,
  Paper,
  Grid,
  TableContainer,
  TableCell,
  TableBody,
  TableRow,
  TableHead,
  Table,
  Modal,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Train as TrainIcon,
  Settings as SettingsIcon,
  EmojiEvents as ChallengesIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

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

const allTrips = await axios.get('/api/userData/allTrips/707');
const allTimeTrips = await axios.get('/api/userData/tripsStats/allTime/707');
const pastMonthTrips = await axios.get('/api/userData/tripsStats/pastMonth/707');
const commonSet = await axios.get('/api/userData/tripsStats/commonSet/707');
const commonCar = await axios.get('/api/userData/tripsStats/commonCar/707');
const monthGroup = await axios.get('/api/userData/tripsStats/monthGroup/707');
const oftenStation = await axios.get('/api/userData/tripsStats/oftenStation/707');

const monthGroupFlipped = monthGroup.data.reverse();

export default function ViewTrips() {
  const [open, setOpen] = useState(false);
  const [stationModalOpen, setStationModalOpen] = useState(false);
  const [carModalOpen, setCarModalOpen] = useState(false);
  const [setModalOpen, setSetModalOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const [tripsTodayModelOpen, setTripsTodayModelOpen] = useState(false);

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

  const handleOpenStationModal = () => setStationModalOpen(true);
  const handleCloseStationModal = () => setStationModalOpen(false);
    const handleOpenCarModal = () => setCarModalOpen(true);
    const handleCloseCarModal = () => setCarModalOpen(false);
    const handleOpenSetModal = () => setSetModalOpen(true);
    const handleCloseSetModal = () => setSetModalOpen(false);
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
            Train Tracking Dashboard
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
            <ListItemButton onClick={() => handleNavigation('/date-trip')}>
              <ListItemIcon>
                <TrainIcon />
              </ListItemIcon>
              <ListItemText primary="Date Trip" />
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
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {/* Cards */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 120, md: 140 },
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  All Time Trips
                </Typography>
                <Typography component="p" variant="h4">
                  {allTimeTrips.data[0].totalTrips}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 120, md: 140 },
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Past Month
                </Typography>
                <Typography component="p" variant="h4">
                  {pastMonthTrips.data[0].totalTrips}
                </Typography>
              </Paper>
            </Grid>


           <Grid item xs={12} md={4}>
              <Paper
                onClick={handleOpenSetModal}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 120, md: 140 },
                }}
                >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Most Common Set
                </Typography>
                <Typography component="p" variant="h4">
                  {commonSet.data[0].setNum} ({commonSet.data[0].frequentSets} trips)
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                onClick={handleOpenCarModal}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 120, md: 140 },
                }}
                >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Most Common Car
                </Typography>
                <Typography component="p" variant="h4">
                  {commonCar.data[0].carNum} ({commonCar.data[0].frequentCars} trips)
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} >
              <Paper
                onClick={handleOpenStationModal}
                sx={{
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 120, md: 140 },
                  cursor: 'pointer',
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Most Common Station
                </Typography>
                <Typography component="p" variant="h4">
                  {oftenStation.data[0].des} ({oftenStation.data[0].frequentStations} trips)
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: { xs: 1.5, md: 2 },
                  display: 'flex',
                  flexDirection: 'column',
                  height: { xs: 120, md: 140 },
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Trips Over Time
                </Typography>
                <LineChart
                  height={100}
                  series={[
                    {
                      data: monthGroupFlipped.map((item: any) => item.trips),
                      area: true,
                      showMark: false,
                      color: '#FFFF00'
                    },
                  ]}
                  xAxis={[
                    {
                      data: monthGroupFlipped.map((item: any) => new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })),
                      label: 'Month',
                      scaleType: 'band',
                      tickLabelStyle: {
                        fill: '#000000',
                        fontSize: 12,
                        fontWeight: 600
                      }
                    },
                  ]}
                  yAxis={[
                    {
                      min: 0,
                      max: Math.max(...monthGroupFlipped.map((item: any) => item.trips)) * 1.1,
                      tickLabelStyle: {
                        fill: '#000000',
                        fontSize: 12,
                        fontWeight: 600
                      }
                    },
                  ]}
                  margin={{ top: 10, bottom: 20, left: 20, right: 20 }}
                  sx={{
                    '.MuiLineElement-root': {
                      strokeWidth: 2
                    }
                  }}
                />
              </Paper>
            </Grid>
            
            {/* Main Content */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Recent Trips
                </Typography>
                <TextField
                  label="Search Trips"
                  variant="outlined"
                  size="small"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  sx={{ mb: 2, maxWidth: 300 }}
                />
                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <DataGrid
                    autoHeight
                    rows={allTrips.data
                      .map((trip: any) => ({
                        id: trip.subID,
                        date: new Date(trip.date).toLocaleString(),
                        setNum: trip.setNum,
                        carNum: trip.carNum,
                        origin: trip.dep,
                        destination: trip.des,
                      }))
                      .filter((row: any) => {
                        const query = searchQuery.toLowerCase();
                        return (
                          row.date.toLowerCase().includes(query) ||
                          String(row.setNum).toLowerCase().includes(query) ||
                          String(row.carNum).toLowerCase().includes(query) ||
                          row.origin.toLowerCase().includes(query) ||
                          row.destination.toLowerCase().includes(query)
                        );
                      })}
                    columns={[
                      { field: 'date', headerName: 'Date', minWidth: 150, flex: 1 },
                      { field: 'setNum', headerName: 'Set', minWidth: 80, flex: 1 },
                      { field: 'carNum', headerName: 'Car', minWidth: 80, flex: 1 },
                      { field: 'origin', headerName: 'Departure', minWidth: 120, flex: 1 },
                      { field: 'destination', headerName: 'Destination', minWidth: 120, flex: 1 },
                    ]}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 15 },
                      },
                    }}
                    pageSizeOptions={[15]}
                    checkboxSelection = {false}
                    disableRowSelectionOnClick
                    sx={{
                      '& .MuiDataGrid-columnHeader': {
                        backgroundColor: '#FFFF00',
                        color: '#000',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      },
                      '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: '900 !important',
                          },
                      '& .MuiDataGrid-cell': {
                        backgroundColor: '#77BFFF',
                        color: '#000',
                        fontSize: '1rem',
                        fontWeight: 700,
                      },
                      '& .MuiToolbar-root': {
                            backgroundColor: '#FFFF00',
                            color: '#000',
                            fontSize: '0.9rem',
                            fontWeight: 700,
                          },
                    }}
                  />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
        {/* Modal for Most Frequent Stations */}
        <Dialog open={stationModalOpen} onClose={handleCloseStationModal} maxWidth="md" fullWidth>
          <DialogTitle>Most Common Stations</DialogTitle>
          <DialogContent>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={oftenStation.data.map((station: any, idx: number) => ({
                  id: idx,
                  station: station.des,
                  count: station.frequentStations,
                }))}
                columns={[
                  { field: 'station', headerName: 'Station', flex: 1 },
                  { field: 'count', headerName: 'Trips', flex: 1 },
                ]}
                pageSizeOptions={[5, 10, 20]}
                autoHeight
                sx={{
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#FFFF00',
                    color: '#000',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: '900 !important',
                      },
                  '& .MuiDataGrid-cell': {
                    backgroundColor: '#77BFFF',
                    color: '#000',
                    fontSize: '1rem',
                    fontWeight: 700,
                  },
                  '& .MuiToolbar-root': {
                        backgroundColor: '#FFFF00',
                        color: '#000',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseStationModal}>Close</Button>
          </DialogActions>
        </Dialog>
          {/* Modal for Most Frequent Cars */}
          <Dialog open={carModalOpen} onClose={handleCloseCarModal} maxWidth="md" fullWidth>
          <DialogTitle>Most Common Cars</DialogTitle>
          <DialogContent>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={commonCar.data.map((car: any, idx: number) => ({
                  id: idx,
                  car: car.carNum,
                  count: car.frequentCars,
                }))}
                columns={[
                  { field: 'car', headerName: 'Car', flex: 1 },
                  { field: 'count', headerName: 'Trips', flex: 1 },
                ]}
                pageSizeOptions={[5, 10, 20]}
                autoHeight
                sx={{
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#FFFF00',
                    color: '#000',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: '900 !important',
                      },
                  '& .MuiDataGrid-cell': {
                    backgroundColor: '#77BFFF',
                    color: '#000',
                    fontSize: '1rem',
                    fontWeight: 700,
                  },
                  '& .MuiToolbar-root': {
                        backgroundColor: '#FFFF00',
                        color: '#000',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseCarModal}>Close</Button>
          </DialogActions>
        </Dialog>
        {/* Modal for Most Frequent Sets */}
        <Dialog open={setModalOpen} onClose={handleCloseSetModal} maxWidth="md" fullWidth>
          <DialogTitle>Most Common Sets</DialogTitle>
          <DialogContent>
            <Box sx={{ height: 400, width: '100%' }}>
              <DataGrid
                rows={commonSet.data.map((set: any, idx: number) => ({
                  id: idx,
                  set: set.setNum,
                  count: set.frequentSets,
                }))}
                columns={[
                  { field: 'set', headerName: 'Set', flex: 1 },
                  { field: 'count', headerName: 'Trips', flex: 1 },
                ]}
                pageSizeOptions={[5, 10, 20]}
                autoHeight
                sx={{
                  '& .MuiDataGrid-columnHeader': {
                    backgroundColor: '#FFFF00',
                    color: '#000',
                    fontSize: '0.9rem',
                    fontWeight: 700,
                  },
                  '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: '900 !important',
                      },
                  '& .MuiDataGrid-cell': {
                    backgroundColor: '#77BFFF',
                    color: '#000',
                    fontSize: '1rem',
                    fontWeight: 700,
                  },
                  '& .MuiToolbar-root': {
                        backgroundColor: '#FFFF00',
                        color: '#000',
                        fontSize: '0.9rem',
                        fontWeight: 700,
                      },
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSetModal}>Close</Button>
          </DialogActions>
        </Dialog>

      </Main>
    </Box>
  );
}
