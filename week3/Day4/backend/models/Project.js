const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  techStack: { type: [String], default: [] },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
