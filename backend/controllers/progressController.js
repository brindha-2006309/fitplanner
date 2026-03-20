// controllers/progressController.js - Handles daily progress tracking

const Progress = require('../models/Progress');

// @desc    Get all progress entries for user (last 30 days)
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const progress = await Progress.find({
      user: req.user._id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 }); // Most recent first

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Log today's progress (weight, calories burned, water, workout)
// @route   POST /api/progress
// @access  Private
const logProgress = async (req, res) => {
  const { weight, caloriesBurned, waterIntake, workoutDone, notes } = req.body;

  try {
    // Check if a progress entry already exists for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let existingProgress = await Progress.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    if (existingProgress) {
      // Update today's existing entry
      if (weight !== undefined)        existingProgress.weight         = weight;
      if (caloriesBurned !== undefined) existingProgress.caloriesBurned = caloriesBurned;
      if (waterIntake !== undefined)    existingProgress.waterIntake    = waterIntake;
      if (workoutDone !== undefined)    existingProgress.workoutDone    = workoutDone;
      if (notes !== undefined)          existingProgress.notes          = notes;

      const updated = await existingProgress.save();
      return res.json(updated);
    }

    // Create a new progress entry for today
    const progress = await Progress.create({
      user: req.user._id,
      weight,
      caloriesBurned,
      waterIntake,
      workoutDone,
      notes,
    });

    res.status(201).json(progress);
  } catch (error) {
    console.error('Log progress error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update water intake for today
// @route   PUT /api/progress/water
// @access  Private
const updateWater = async (req, res) => {
  const { waterIntake } = req.body;

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let progress = await Progress.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    if (progress) {
      progress.waterIntake = waterIntake;
      await progress.save();
    } else {
      progress = await Progress.create({
        user:        req.user._id,
        waterIntake: waterIntake,
      });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get today's progress entry
// @route   GET /api/progress/today
// @access  Private
const getTodayProgress = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const progress = await Progress.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    res.json(progress || { waterIntake: 0, caloriesBurned: 0, workoutDone: false });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProgress, logProgress, updateWater, getTodayProgress };
