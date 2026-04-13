// controllers/authController.js - Handles user registration and login

const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Helper function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if a user with the same email already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create the new user (password hashing happens in model pre-save hook)
    const user = await User.create({ name, email, password });

    if (user) {
      return res.status(201).json({
        _id:   user._id,
        name:  user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Login user and return JWT token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // Verify user exists and password matches
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id:         user._id,
        name:        user.name,
        email:       user.email,
        fitnessGoal: user.fitnessGoal,
        token:       generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
  const { credential } = req.body;
  if (!credential) {
    console.error('Google login error: No credential received from frontend');
    return res.status(400).json({ message: 'No credential received from Google' });
  }

  try {
    console.log('googleLogin: Verifying token with GOOGLE_CLIENT_ID =', process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    console.log('googleLogin: Token verified successfully for user:', payload.email);
    const { sub, email, name, picture } = payload;
    
    let user = await User.findOne({ email });
    if (!user) {
      console.log('googleLogin: Creating new user for:', email);
      user = await User.create({
        name,
        email,
        isGoogleAuth: true,
      });
    } else {
      console.log('googleLogin: Found existing user for:', email);
      if (!user.isGoogleAuth) {
         user.isGoogleAuth = true;
         await user.save();
      }
    }
    
    res.json({
        _id:         user._id,
        name:        user.name,
        email:       user.email,
        fitnessGoal: user.fitnessGoal,
        token:       generateToken(user._id),
      });
  } catch (error) {
    console.error('Google login details error:', error);
    res.status(401).json({ message: 'Google login failed: Invalid Client / Token' });
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'There is no user with that email' });
    }

    // Get reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash token and set to resetPasswordToken field
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    // Set expire (15 mins)
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    
    await user.save({ validateBeforeSave: false });

    // Create reset url
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request or visit: \n\n ${resetUrl}`;

    console.log('forgotPassword: Setup Transporter using EMAIL_USER =', process.env.EMAIL_USER);

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      console.log('forgotPassword: Sending mail to', user.email);
      await transporter.sendMail({
        from: `FitPlanner <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Token',
        text: message,
      });

      console.log('forgotPassword: Email sent successfully.');
      res.status(200).json({ success: true, message: 'Email sent' });
    } catch (err) {
      console.error('forgotPassword email sending error:', err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ message: 'Email could not be sent' });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    if (!req.body.password || req.body.password.length < 6) {
       return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    
    await user.save();

    res.json({
        _id:         user._id,
        name:        user.name,
        email:       user.email,
        fitnessGoal: user.fitnessGoal,
        token:       generateToken(user._id),
        message:     'Password reset successfully'
      });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { registerUser, loginUser, getMe, googleLogin, forgotPassword, resetPassword };
