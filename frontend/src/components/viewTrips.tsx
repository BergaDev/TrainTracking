import { useState } from 'react';
import { styled } from '@mui/material/styles';
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
} from '@mui/material';
import { LineChart } from '@mui/x-charts';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Train as TrainIcon,
  Settings as SettingsIcon,
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

export default function ViewTrips() {
  const [open, setOpen] = useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
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
            <ListItemButton>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <TrainIcon />
              </ListItemIcon>
              <ListItemText primary="Trains" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
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
          <Grid container spacing={3}>
            {/* Cards */}
            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
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
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
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
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
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
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
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

            <Grid item xs={12} md={4}>
              <Paper
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 140,
                }}
              >
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Trips Over Time
                </Typography>
                <LineChart
                  height={100}
                  series={[
                    {
                      data: monthGroup.data.map((item: any) => item.totalTrips),
                      area: true,
                    },
                  ]}
                  xAxis={[
                    {
                      data: monthGroup.data.map((item: any) => new Date(item.month + '-01').toLocaleDateString('en-US', { month: 'short' })),
                      label: 'Month',
                      scaleType: 'point',
                    },
                  ]}
                  yAxis={[
                    {
                      data: monthGroup.data.map((item: any) => item.trips),
                    },
                  ]}
                  margin={{ top: 10, bottom: 20, left: 20, right: 20 }}
                />
              </Paper>
            </Grid>
            
            {/* Main Content */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  Recent Trips
                </Typography>
                <div style={{ height: 400, width: '100%' }}>
                  <DataGrid
                    rows={allTrips.data.map((trip: any) => ({
                      id: trip.subID,
                      date: new Date(trip.date).toLocaleString(),
                      setNum: trip.setNum,
                      carNum: trip.carNum,
                      origin: trip.dep,
                      destination: trip.des,
                    }))}
                    columns={[
                      { field: 'date', headerName: 'Date', width: 200},
                      { field: 'setNum', headerName: 'Set', width: 130 },
                      { field: 'carNum', headerName: 'Car', width: 130 },
                      { field: 'origin', headerName: 'Origin', width: 130 },
                      { field: 'destination', headerName: 'Destination', width: 130 },
                    ]}
                    initialState={{
                      pagination: {
                        paginationModel: { pageSize: 15 },
                      },
                    }}
                    pageSizeOptions={[15]}
                    checkboxSelection
                    disableRowSelectionOnClick
                    sortModel={[
                      { field: 'date', sort: 'desc' },
                    ]}
                  />
                </div>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Main>
    </Box>
  );
}
