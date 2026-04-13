// routes/authRoutes.js - Authentication routes

const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, googleLogin, forgotPassword, resetPassword } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);   // POST /api/auth/register
router.post('/login',    loginUser);      // POST /api/auth/login
router.post('/google',   googleLogin);    // POST /api/auth/google
router.post('/forgot-password', forgotPassword); // POST /api/auth/forgot-password
router.put('/reset-password/:token', resetPassword); // PUT /api/auth/reset-password/:token
router.get('/me',        protect, getMe); // GET  /api/auth/me (protected)

module.exports = router;
