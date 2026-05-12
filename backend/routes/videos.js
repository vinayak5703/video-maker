const router = require('express').Router();
const videoController = require('../controllers/videoController');

// POST: /api/videos (Create Project)
router.post('/', videoController.createProject);

// GET: /api/videos/find/:userId (Get User's Projects)
router.get('/find/:userId', videoController.getUserProjects);

module.exports = router;