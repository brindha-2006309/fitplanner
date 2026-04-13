// controllers/profileController.js - Handles user profile CRUD operations

const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update user profile (age, gender, height, weight, fitnessGoal, goals)
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
  const { name, age, gender, height, weight, fitnessGoal, waterGoal, caloriesGoal, mealTimes, workoutTime } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update only provided fields
    if (name)         user.name         = name;
    if (age)          user.age          = age;
    if (gender)       user.gender       = gender;
    if (height)       user.height       = height;
    if (weight)       user.weight       = weight;
    if (fitnessGoal)  user.fitnessGoal  = fitnessGoal;
    if (waterGoal !== undefined) user.waterGoal = waterGoal;
    if (caloriesGoal) user.caloriesGoal = caloriesGoal;
    
    if (mealTimes) {
       user.mealTimes = { ...user.mealTimes, ...mealTimes };
    }
    if (workoutTime) user.workoutTime = workoutTime;

    const updatedUser = await user.save();
    res.json({
      _id:          updatedUser._id,
      name:         updatedUser.name,
      email:        updatedUser.email,
      age:          updatedUser.age,
      gender:       updatedUser.gender,
      height:       updatedUser.height,
      weight:       updatedUser.weight,
      fitnessGoal:  updatedUser.fitnessGoal,
      waterGoal:    updatedUser.waterGoal,
      caloriesGoal: updatedUser.caloriesGoal,
      mealTimes:    updatedUser.mealTimes,
      workoutTime:  updatedUser.workoutTime,
      streak:       updatedUser.streak,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, updateProfile };
