// routes/workoutRoutes.js - Workout plan routes

const express = require('express');
const router = express.Router();
const { getWorkoutPlan, generateWorkoutPlan, markWorkoutComplete } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',                    protect, getWorkoutPlan);        // GET  /api/workout
router.post('/generate',           protect, generateWorkoutPlan);   // POST /api/workout/generate
router.put('/complete/:dayIndex',   protect, markWorkoutComplete);   // PUT  /api/workout/complete/:dayIndex

module.exports = router;
