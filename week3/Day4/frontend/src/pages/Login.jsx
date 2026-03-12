import React, { useState, useEffect, useRef } from 'react';
import { Container, Paper, TextField, Button, Typography, Box, Grid, Link as MuiLink } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../services/api';
import { fadeIn, slideUp, staggerFadeIn } from '../components/animations/gsapUtils';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const containerRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    fadeIn(containerRef.current);
    staggerFadeIn('.form-field', 0.5);
  }, [isSignup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = isSignup ? await register(formData) : await login(formData);
      localStorage.setItem('profile', JSON.stringify(data));
      navigate('/');
      window.location.reload();
    } catch (err) {
        setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  const switchMode = () => {
    setIsSignup((prev) => !prev);
    setError('');
  };

  return (
    <Container maxWidth="xs" ref={containerRef} sx={{ mt: 10 }}>
      <Paper elevation={12} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 800 }}>
          {isSignup ? 'Create Account' : 'Welcome Back'}
        </Typography>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
          {isSignup ? 'Join our amazing team' : 'Log in to manage your projects'}
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: '100%' }} ref={formRef}>
          <Grid container spacing={2}>
            {isSignup && (
              <Grid item xs={12} className="form-field">
                <TextField
                  name="name"
                  label="Full Name"
                  fullWidth
                  variant="outlined"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12} className="form-field">
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} className="form-field">
              <TextField
                name="password"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </Grid>
          </Grid>
          
          {error && (
            <Typography color="error" variant="caption" sx={{ mt: 2, display: 'block' }}>
              {error}
            </Typography>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
            className="form-field"
          >
            {isSignup ? 'Sign Up' : 'Sign In'}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <MuiLink
              component="button"
              variant="body2"
              onClick={switchMode}
              sx={{ color: 'primary.main', fontWeight: 600, textDecoration: 'none' }}
            >
              {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </MuiLink>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
