import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Stepper, Step, StepLabel, StepContent, Paper } from '@mui/material';
import { fetchProjects, createProject, updateProject, deleteProject, fetchMembers } from '../services/api';
import { staggerFadeIn, scaleIn, fadeIn } from '../components/animations/gsapUtils';
import AddIcon from '@mui/icons-material/Add';
import ProjectCard from '../components/ProjectCard';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [members, setMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProject, setCurrentProject] = useState({ title: '', description: '', techStack: '', status: 'active', teamMembers: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: projectsData } = await fetchProjects();
      const { data: membersData } = await fetchMembers();
      setProjects(projectsData);
      setMembers(membersData);
      staggerFadeIn('.project-card', 0.2);
      fadeIn('.timeline-section', 0.5);
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpen = (project = null) => {
    if (project) {
      setIsEdit(true);
      setCurrentProject({ ...project, techStack: project.techStack.join(', ') });
    } else {
      setIsEdit(false);
      setCurrentProject({ title: '', description: '', techStack: '', status: 'active', teamMembers: [] });
    }
    setOpen(true);
    setTimeout(() => scaleIn('.MuiDialog-paper'), 50);
  };

  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const finalProject = { ...currentProject, techStack: currentProject.techStack.split(',').map(s => s.trim()) };
    try {
      if (isEdit) {
        await updateProject(currentProject._id, finalProject);
      } else {
        await createProject(finalProject);
      }
      loadData();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this project?')) {
      await deleteProject(id);
      loadData();
    }
  };

  const completedProjects = projects.filter(p => p.status === 'completed');

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>Projects Portfolio</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>New Project</Button>
      </Box>

      <Grid container spacing={4}>
        {/* Main Projects List */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item xs={12} sm={6} key={project._id}>
                <ProjectCard 
                  project={project} 
                  onEdit={handleOpen} 
                  onDelete={handleDelete} 
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Project Timeline Section */}
        <Grid item xs={12} md={4} className="timeline-section">
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>Project History</Typography>
          <Paper sx={{ p: 3 }}>
            <Stepper orientation="vertical">
              {completedProjects.length > 0 ? (
                completedProjects.map((project, index) => (
                  <Step key={index} active={true}>
                    <StepLabel>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{project.title}</Typography>
                    </StepLabel>
                    <StepContent>
                      <Typography variant="caption" color="textSecondary">{project.description}</Typography>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: 'primary.main' }}>
                          Completed with {project.teamMembers.length} members
                        </Typography>
                      </Box>
                    </StepContent>
                  </Step>
                ))
              ) : (
                <Typography variant="body2" color="textSecondary">No completed projects yet.</Typography>
              )}
            </Stepper>
          </Paper>
        </Grid>
      </Grid>

      {/* Project Dialog */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit Project' : 'Add New Project'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Title"
            fullWidth
            value={currentProject.title}
            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={currentProject.description}
            onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Tech Stack (comma separated)"
            fullWidth
            value={currentProject.techStack}
            onChange={(e) => setCurrentProject({ ...currentProject, techStack: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={currentProject.status}
              label="Status"
              onChange={(e) => setCurrentProject({ ...currentProject, status: e.target.value })}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Team Members</InputLabel>
            <Select
              multiple
              value={currentProject.teamMembers}
              label="Team Members"
              onChange={(e) => setCurrentProject({ ...currentProject, teamMembers: e.target.value })}
              renderValue={(selected) => {
                return members.filter(m => selected.includes(m._id)).map(m => m.name).join(', ')
              }}
            >
              {members.map((member) => (
                <MenuItem key={member._id} value={member._id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">{isEdit ? 'Update' : 'Create'}</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Projects;
