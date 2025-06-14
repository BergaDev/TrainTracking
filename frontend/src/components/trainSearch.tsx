import React, { useState } from 'react';
import axios from 'axios';
import '../styles/globals.css';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';

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
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { DataGrid } from '@mui/x-data-grid';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Train as TrainIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

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

interface CarSet {
  carNum: string;
  setNum: string;
}

const TrainSearch: React.FC = () => {
  const [setCarQuery, setSetCarQuery] = useState('');
  const [carSetResults, setCarSetResults] = useState<CarSet[]>([]);
  const [selectedCarSet, setSelectedCarSet] = useState<string>('');
  const [hasSearched, setHasSearched] = useState(false);
  const [open, setOpen] = useState(false);
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

  const handleSetCarSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/trainData/search/train/${setCarQuery}`);
      const resultsWithIds = response.data.map((item: CarSet, index: number) => ({
        ...item,
        id: index
      }));
      setCarSetResults(resultsWithIds);
      setHasSearched(true);
      if (response.data.length > 0) {
        const firstResult = response.data[0];
        setSelectedCarSet(`${firstResult.carNum}|${firstResult.setNum}`);
      }
    } catch (error) {
      console.error('Error searching for car sets:', error);
    }
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    setSelectedCarSet(event.target.value);
  };


  const carTypeCheck = (carNum: string, typeName: string) => {
    //OSCAR
    if (typeName.includes('OSCAR')) {
      if (carNum.includes('OD')) {
        return 'Driving Car';
      } else if (carNum.includes('ON')) {
        return 'Non-Control Motor';
      } else if (carNum.includes('ONL')) {
        return 'Non-Control Motor with Lavatory';
      }
    } else if (typeName.includes('Waratah')) {
      if (carNum.includes('D')) {
        return 'Driving Trailer';
      } else if (carNum.includes('N')) {
        return 'Non Driving Motor';
      } else if (carNum.includes('T')) {
        return 'Non Driving Trailer';
      }
    } else if (typeName.includes('Millennium')) {
      if (carNum.includes('D')) {
        return 'Driving Trailer';
      } else if (carNum.includes('N')) {
        return 'Non Control Motor';
      }
    } else if (typeName.includes('V Set')) {
      if (carNum.includes('M')) {
        return 'Double-Deck Motor';
      } else if (carNum.includes('T')) {
        return 'Double-Deck Trailer';
      } else if (carNum.includes('DC')) {
        return 'Double-Deck Driving Trailer';
      }
    } else if (typeName.includes('Tangara')) {
      if (carNum.includes('D')) {
        return 'Driving Trailer';
      } else if (carNum.includes('N')) {
        return 'Motor Car';
      }
    } else {
        return 'No data yet';
    }
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
            Train Search
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
              <ListItemText primary="Dashboard" />
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
        <Container maxWidth="md" id="new-trip-container">
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" component="h2" gutterBottom align="center">
              Train Set Search
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

                {hasSearched && (
                  <Grid item xs={12}>
                  <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                    <Typography component="h2" variant="h6" color="primary" gutterBottom>
                      Recent Trips
                    </Typography>
                    <Box sx={{ width: '100%', overflowX: 'auto' }}>
                      <DataGrid
                        autoHeight
                        rows={carSetResults.map((carSet: CarSet, index: number) => ({
                          id: index,
                          carNum: carSet.carNum,
                          setNum: carSet.setNum,
                          type: carTypeCheck(carSet.carNum, carSet.typeName),
                        }))}
                        columns={[
                          { field: 'carNum', headerName: 'Car', minWidth: 80, flex: 1 },
                          { field: 'setNum', headerName: 'Set', minWidth: 80, flex: 1 },
                          { field: 'type', headerName: 'Type', minWidth: 120, flex: 1 },
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
                          '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#FFFF00',
                          },
                          '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#FFFF00',
                            color: '#000',
                            fontSize: '0.9rem',
                            fontWeight: '900',
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
                )}
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Main>
    </Box>
  );
};

export default TrainSearch;
