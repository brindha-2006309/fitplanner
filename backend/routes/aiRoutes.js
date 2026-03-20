const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Define the POST /chat route with protect
router.post('/chat', protect, chat);

module.exports = router;
