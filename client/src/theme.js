import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    // Brand palette taken from the style guide:
    // Mint: #9AD4BD, Deep Green: #1F423C, Near Black: #231F20, Gray: #6D6E6E
    primary: {
      main: '#1F423C',
      light: '#2b5a52',
      dark: '#132a26',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9AD4BD',
      light: '#bfe5d6',
      dark: '#6fbca3',
      contrastText: '#231F20',
    },
    tertiary: {
      main: '#6D6E6E',
      light: '#8e8f8f',
      dark: '#4f5050',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
      alt: '#F4FBF8', // subtle mint-tinted off-white
    },
    text: {
      primary: '#231F20',
      secondary: '#6D6E6E',
      disabled: '#9ea0a0',
    },
    divider: '#E0E0E0',
    success: {
      main: '#4CAF50',
    },
    warning: {
      main: '#FF9800',
    },
    error: {
      main: '#F44336',
    },
  },
  typography: {
    // Body text: Metropolis (using Montserrat as Google Fonts equivalent)
    fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
    h1: {
      // Titles: Calisga (using Calistoga as Google Fonts equivalent)
      fontFamily: '"Calistoga", serif',
      fontSize: '3.5rem',
      fontWeight: 400,
      lineHeight: 1.2,
      letterSpacing: '0.01em',
    },
    h2: {
      fontFamily: '"Calistoga", serif',
      fontSize: '2.75rem',
      fontWeight: 400,
      lineHeight: 1.3,
      letterSpacing: '0.01em',
    },
    h3: {
      fontFamily: '"Calistoga", serif',
      fontSize: '2.25rem',
      fontWeight: 400,
      lineHeight: 1.3,
    },
    h4: {
      fontFamily: '"Calistoga", serif',
      fontSize: '1.75rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    h5: {
      fontFamily: '"Calistoga", serif',
      fontSize: '1.25rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Calistoga", serif',
      fontSize: '1.1rem',
      fontWeight: 400,
      lineHeight: 1.4,
    },
    body1: {
      // Metropolis Regular
      fontSize: '1rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
      fontWeight: 400,
    },
    button: {
      // Metropolis Bold for buttons
      fontFamily: '"Montserrat", sans-serif',
      fontSize: '0.875rem',
      fontWeight: 700,
      textTransform: 'none',
      letterSpacing: '0.025em',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '12px 24px',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
        contained: {
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme;