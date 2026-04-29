'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ea7c69',
      light: '#f19b8e',
      dark: '#d4604f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#9288e0',
      light: '#b0a8ec',
      dark: '#6c5fbd',
    },
    background: {
      default: '#1f1d2b',
      paper: '#252836',
    },
    text: {
      primary: '#ffffff',
      secondary: '#abbbc2',
    },
    success: {
      main: '#50d1aa',
    },
    warning: {
      main: '#ffb572',
    },
    error: {
      main: '#ff7ca3',
    },
    info: {
      main: '#65b0f6',
    },
    divider: '#393c49',
  },
  typography: {
    fontFamily: '"Barlow", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 600, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.5rem' },
    h3: { fontWeight: 600, fontSize: '1.25rem' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 500, fontSize: '1rem' },
    h6: { fontWeight: 500, fontSize: '0.875rem' },
    body1: { fontSize: '0.875rem' },
    body2: { fontSize: '0.75rem', color: '#abbbc2' },
    caption: { fontSize: '0.7rem', color: '#abbbc2' },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#1f1d2b',
          borderRadius: 12,
          border: '1px solid #393c49',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: '#2d303e',
            '& fieldset': { borderColor: '#393c49' },
            '&:hover fieldset': { borderColor: '#ea7c69' },
            '&.Mui-focused fieldset': { borderColor: '#ea7c69' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

export default theme;
