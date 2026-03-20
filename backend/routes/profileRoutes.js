// routes/profileRoutes.js - User profile routes

const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',  protect, getProfile);    // GET /api/profile
router.put('/',  protect, updateProfile); // PUT /api/profile

module.exports = router;
