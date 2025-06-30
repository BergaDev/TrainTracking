import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFFF00',
    },
    secondary: {
      main: '#ff9800',
    },
    background: {
      default: '#2D9DFF',
      paper: 'rgba(179, 246, 255, 0.34)',
    },
    text: {
      primary: '#222',
      secondary: '#555',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#2D9DFF',
        }
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          backgroundColor: '#FFFF00',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1565c0',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#1976d2',
            borderWidth: 2,
          },
        },
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          color: '#000',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        root: {
          fontWeight: 900,
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#FFFF00',
        },
        icon: {
          color: '#000',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: '#2D9DFF',
        },
        list: {
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 900,
          border: '2px solid #FFFF00',
          color: '#000',
          borderRadius: '8px',
          '&:hover': {
            backgroundColor: '#e3f2fd',
          },
          '&.Mui-selected': {
            backgroundColor: '#bbdefb',
            '&:hover': {
              backgroundColor: '#90caf9',
            },
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 900,
    },
    h2: {
      fontFamily: '"Bobaland", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
    h6: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 900,
    },
    body1: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    body2: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 700,
    },
    button: {
      fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
      fontWeight: 500,
    },
  },
});

export default theme; 