const VideoProject = require('../models/VideoProject');

// Create New Project
exports.createProject = async (req, res) => {
  const newProject = new VideoProject(req.body);
  try {
    const savedProject = await newProject.save();
    res.status(200).json(savedProject);
  } catch (err) {
    res.status(500).json(err);
  }
};

// Get All Projects for a User
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await VideoProject.find({ userId: req.params.userId });
    res.status(200).json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
};