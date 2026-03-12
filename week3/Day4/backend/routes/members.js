const express = require('express');
const router = express.Router();
const Member = require('../models/Member');
const { protect } = require('../middleware/auth');

// Get all members
router.get('/', protect, async (req, res) => {
  try {
    const members = await Member.find({}).populate('projects', 'title');
    res.json(members);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a member
router.post('/', protect, async (req, res) => {
  const { name, role, email, avatar, projects } = req.body;

  try {
    const member = new Member({
      name,
      role,
      email,
      avatar,
      projects
    });

    const createdMember = await member.save();
    res.status(201).json(createdMember);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a member
router.put('/:id', protect, async (req, res) => {
  const { name, role, email, avatar, projects } = req.body;

  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      member.name = name || member.name;
      member.role = role || member.role;
      member.email = email || member.email;
      member.avatar = avatar || member.avatar;
      member.projects = projects || member.projects;

      const updatedMember = await member.save();
      res.json(updatedMember);
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a member
router.delete('/:id', protect, async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);

    if (member) {
      await member.deleteOne();
      res.json({ message: 'Member removed' });
    } else {
      res.status(404).json({ message: 'Member not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
