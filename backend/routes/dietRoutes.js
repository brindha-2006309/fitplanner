// routes/dietRoutes.js - Diet plan routes

const express = require('express');
const router = express.Router();
const { getDietPlan, generateDietPlan, markMealComplete } = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

router.get('/',          protect, getDietPlan);      // GET  /api/diet
router.post('/generate', protect, generateDietPlan); // POST /api/diet/generate
router.put('/complete/:mealType', protect, markMealComplete); // PUT /api/diet/complete/:mealType

module.exports = router;
