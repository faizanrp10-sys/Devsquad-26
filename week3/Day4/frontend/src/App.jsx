import React, { useState, useMemo, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline, Box } from '@mui/material';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Members from './pages/Members';
import Login from './pages/Login';
import { gsap } from 'gsap';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

const TransitionWrapper = ({ children }) => {
  const location = useLocation();
  const nodeRef = React.useRef(null);

  useEffect(() => {
    if (nodeRef.current) {
      gsap.fromTo(nodeRef.current, 
        { opacity: 0, x: -20 }, 
        { opacity: 1, x: 0, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, [location]);

  return (
    <Box ref={nodeRef} sx={{ minHeight: 'calc(100vh - 64px)' }}>
      {children}
    </Box>
  );
};

function App() {
  const [mode, setMode] = useState(localStorage.getItem('theme') || 'dark');
  const user = JSON.parse(localStorage.getItem('profile'));

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme', newMode);
        return newMode;
      });
    },
  }), []);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#6366f1',
      },
      secondary: {
        main: '#ec4899',
      },
      background: {
        default: mode === 'dark' ? '#0f172a' : '#f8fafc',
        paper: mode === 'dark' ? '#1e293b' : '#ffffff',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundImage: 'none',
          },
        },
      },
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <TransitionWrapper>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={user ? <Projects /> : <Navigate to="/login" />} />
              <Route path="/members" element={user ? <Members /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </TransitionWrapper>
        </Router>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
