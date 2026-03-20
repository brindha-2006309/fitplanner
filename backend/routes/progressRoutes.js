// routes/progressRoutes.js - Progress tracking routes

const express = require('express');
const router = express.Router();
const { getProgress, logProgress, updateWater, getTodayProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',       protect, getProgress);      // GET  /api/progress (30-day history)
router.post('/',      protect, logProgress);       // POST /api/progress (log today)
router.put('/water',  protect, updateWater);       // PUT  /api/progress/water
router.get('/today',  protect, getTodayProgress);  // GET  /api/progress/today

module.exports = router;
