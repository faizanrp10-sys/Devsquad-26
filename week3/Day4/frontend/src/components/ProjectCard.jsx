import React from 'react';
import { Card, CardContent, CardActions, Typography, Box, Chip, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  return (
    <Card className="project-card" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            {project.title}
          </Typography>
          <Chip 
            label={project.status} 
            size="small" 
            color={project.status === 'active' ? 'primary' : 'success'} 
          />
        </Box>
        <Typography color="textSecondary" sx={{ mb: 2 }}>{project.description}</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
          {project.techStack.map((tech, i) => (
            <Chip key={i} label={tech} size="small" variant="outlined" />
          ))}
        </Box>
        {project.teamMembers.length > 0 && (
           <Typography variant="caption" display="block">Team: {project.teamMembers.map(m => m.name).join(', ')}</Typography>
        )}
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
        <Button size="small" startIcon={<EditIcon />} onClick={() => onEdit(project)}>Edit</Button>
        <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => onDelete(project._id)}>Delete</Button>
      </CardActions>
    </Card>
  );
};

export default ProjectCard;
