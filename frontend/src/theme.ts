import { createTheme } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';

const globalStyles = {
  '@font-face': [
    {
      fontFamily: 'Dotto',
      src: `url('/fonts/Doto-VariableFont_ROND,wght.ttf') format('truetype')`,
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Bobaland',
      src: `url('/fonts/Bobaland-OVXB3.otf') format('opentype')`,
      fontWeight: 400,
      fontStyle: 'normal',
    },
    {}
  ]
};

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
        },
        ...globalStyles
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
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
    MuiSelect: {
      styleOverrides: {
        select: {
          backgroundColor: '#fff',
        },
        icon: {
          color: '#1976d2',
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
    MuiDataGrid: {
      styleOverrides: {
        container: {
          backgroundColor: '#77BFFF',
        },
      },
    },
  },
  typography: {
    fontFamily: '"Dotto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Dotto"',
    },
    h2: {
      fontFamily: '"Bobaland"',
    },
    h3: {
      fontFamily: '"Dotto"',
    },
    h4: {
      fontFamily: '"Dotto"',
    },
  },
});

export default theme; 