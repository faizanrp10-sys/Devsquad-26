import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Box, Grid, Paper, Button, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { fetchProjects, fetchMembers } from '../services/api';
import { fadeIn, slideUp, staggerFadeIn, countUp } from '../components/animations/gsapUtils';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalProjects: 0, activeProjects: 0, teamSize: 0, completedProjects: 0 });
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const statRefs = useRef([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const { data: projects } = await fetchProjects();
        const { data: members } = await fetchMembers();
        
        const active = projects.filter(p => p.status === 'active').length;
        const completed = projects.filter(p => p.status === 'completed').length;
        
        setStats({
          totalProjects: projects.length,
          activeProjects: active,
          teamSize: members.length,
          completedProjects: completed
        });
      } catch (err) {
        console.log(err);
      }
    };

    getData();
    
    // Animations
    fadeIn(heroRef.current);
    slideUp('.hero-cta', 1);
    staggerFadeIn('.stat-card', 0.8);
  }, []);

  useEffect(() => {
    if (stats.totalProjects > 0) {
        // Trigger countUp animations when data is loaded
        const counts = document.querySelectorAll('.stat-number');
        counts.forEach((el, i) => {
            const val = [stats.totalProjects, stats.teamSize, stats.activeProjects, stats.completedProjects][i];
            countUp(el, val);
        });
    }
  }, [stats]);

  return (
    <Container maxWidth="lg" sx={{ pt: 10, pb: 10 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 10 }} ref={heroRef}>
        <Typography variant="h1" gutterBottom sx={{ fontSize: { xs: '3rem', md: '5rem' }, mb: 4, background: 'linear-gradient(45deg, #6366f1 30%, #ec4899 90%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Innovate Faster. <br /> Manage Smarter.
        </Typography>
        <Typography variant="h5" color="textSecondary" sx={{ maxWidth: 700, mx: 'auto', mb: 6 }}>
          The ultimate platform for high-performance teams to showcase their projects and manage resources with elegance.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" className="hero-cta">
          <Button variant="contained" size="large" component={Link} to="/projects" sx={{ px: 4, py: 1.5 }}>View Projects</Button>
          <Button variant="outlined" size="large" component={Link} to="/members" sx={{ px: 4, py: 1.5 }}>Meet The Team</Button>
        </Stack>
      </Box>

      {/* Stats Widgets */}
      <Grid container spacing={4} sx={{ mt: 4 }} ref={statsRef}>
        {[
          { label: 'Total Projects', value: stats.totalProjects, color: '#6366f1' },
          { label: 'Team Members', value: stats.teamSize, color: '#ec4899' },
          { label: 'Active Tasks', value: stats.activeProjects, color: '#10b981' },
          { label: 'Completed', value: stats.completedProjects, color: '#f59e0b' }
        ].map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper className="stat-card" elevation={4} sx={{ p: 3, textAlign: 'center', borderTop: `4px solid ${stat.color}` }}>
              <Typography variant="h3" className="stat-number" sx={{ fontWeight: 800, mb: 1 }}>0</Typography>
              <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 600 }}>{stat.label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Dashboard;
