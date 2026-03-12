const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');

// Get all projects
router.get('/', protect, async (req, res) => {
  try {
    const projects = await Project.find({}).populate('teamMembers', 'name role');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a project
router.post('/', protect, async (req, res) => {
  const { title, description, techStack, status, teamMembers } = req.body;

  try {
    const project = new Project({
      title,
      description,
      techStack,
      status,
      teamMembers
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a project
router.put('/:id', protect, async (req, res) => {
  const { title, description, techStack, status, teamMembers } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      project.techStack = techStack || project.techStack;
      project.status = status || project.status;
      project.teamMembers = teamMembers || project.teamMembers;

      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a project
router.delete('/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      await project.deleteOne();
      res.json({ message: 'Project removed' });
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
