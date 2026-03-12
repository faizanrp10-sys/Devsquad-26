import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, IconButton, useTheme } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ColorModeContext } from '../App';

const Navbar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const user = JSON.parse(localStorage.getItem('profile'));

  const logout = () => {
    localStorage.removeItem('profile');
    navigate('/login');
    window.location.reload();
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ 
      background: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)', 
      backdropFilter: 'blur(8px)', 
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      color: 'text.primary'
    }}>
      <Container maxWidth="xl">
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit', fontWeight: 800, letterSpacing: -0.5 }}
          >
            PORTAL<span style={{ color: '#6366f1' }}>.</span>
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button color="inherit" component={Link} to="/">Home</Button>
            {user && (
              <>
                <Button color="inherit" component={Link} to="/projects">Projects</Button>
                <Button color="inherit" component={Link} to="/members">Team</Button>
                <Button variant="outlined" color="primary" onClick={logout}>Logout</Button>
              </>
            )}
            {!user && (
              <Button variant="contained" color="primary" component={Link} to="/login">Login</Button>
            )}
            
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
