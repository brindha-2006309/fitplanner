// middleware/authMiddleware.js - Protect routes with JWT authentication

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token is in the Authorization header (Bearer token)
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token from "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using the JWT secret
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach the user (without password) to the request object
      req.user = await User.findById(decoded.id).select('-password');

      next(); // Move to the next middleware/controller
    } catch (error) {
      console.error('Token verification failed:', error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };
