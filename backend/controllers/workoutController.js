// controllers/workoutController.js - Handles workout plan generation and management

const Workout = require('../models/Workout');
const User = require('../models/User');

// Pre-defined workout plans based on fitness goal
const workoutPlans = {
  weight_loss: [
    { day: 'Monday',    focus: 'Full Body HIIT',     exercises: [
      { name: 'Jumping Jacks',   sets: 3, reps: '30',    restTime: '30 sec' },
      { name: 'Burpees',         sets: 3, reps: '15',    restTime: '45 sec' },
      { name: 'Mountain Climbers', sets: 3, reps: '20',  restTime: '30 sec' },
      { name: 'High Knees',      sets: 3, reps: '30',    restTime: '30 sec' },
    ]},
    { day: 'Tuesday',   focus: 'Cardio',             exercises: [
      { name: 'Treadmill Run',   sets: 1, reps: '30 min', restTime: '-' },
      { name: 'Jump Rope',       sets: 3, reps: '2 min',  restTime: '60 sec' },
      { name: 'Cycling',         sets: 1, reps: '20 min', restTime: '-' },
    ]},
    { day: 'Wednesday', focus: 'Legs & Glutes',      exercises: [
      { name: 'Squats',          sets: 4, reps: '15',    restTime: '60 sec' },
      { name: 'Lunges',          sets: 3, reps: '12',    restTime: '60 sec' },
      { name: 'Glute Bridges',   sets: 3, reps: '20',    restTime: '45 sec' },
      { name: 'Wall Sit',        sets: 3, reps: '45 sec', restTime: '60 sec' },
    ]},
    { day: 'Thursday',  focus: 'Arms & Core',        exercises: [
      { name: 'Push-ups',        sets: 3, reps: '15',    restTime: '45 sec' },
      { name: 'Tricep Dips',     sets: 3, reps: '12',    restTime: '45 sec' },
      { name: 'Plank',           sets: 3, reps: '60 sec', restTime: '60 sec' },
      { name: 'Bicycle Crunches', sets: 3, reps: '20',   restTime: '30 sec' },
    ]},
    { day: 'Friday',    focus: 'Cardio + Core',      exercises: [
      { name: 'Running',         sets: 1, reps: '25 min', restTime: '-' },
      { name: 'Crunches',        sets: 4, reps: '25',    restTime: '30 sec' },
      { name: 'Leg Raises',      sets: 3, reps: '15',    restTime: '45 sec' },
    ]},
    { day: 'Saturday',  focus: 'Active Recovery',    exercises: [
      { name: 'Yoga / Stretching', sets: 1, reps: '30 min', restTime: '-' },
      { name: 'Light Walk',       sets: 1, reps: '20 min', restTime: '-' },
    ]},
    { day: 'Sunday',    focus: 'Rest Day',           exercises: [] },
  ],
  muscle_gain: [
    { day: 'Monday',    focus: 'Chest',              exercises: [
      { name: 'Bench Press',     sets: 4, reps: '8-10',  restTime: '90 sec' },
      { name: 'Incline DB Press',sets: 3, reps: '10-12', restTime: '90 sec' },
      { name: 'Cable Fly',       sets: 3, reps: '12-15', restTime: '60 sec' },
      { name: 'Push-ups',        sets: 3, reps: '12',    restTime: '60 sec' },
    ]},
    { day: 'Tuesday',   focus: 'Back',               exercises: [
      { name: 'Deadlift',        sets: 4, reps: '6-8',   restTime: '120 sec' },
      { name: 'Pull-ups',        sets: 4, reps: '8-10',  restTime: '90 sec' },
      { name: 'Barbell Rows',    sets: 3, reps: '10-12', restTime: '90 sec' },
      { name: 'Lat Pulldown',    sets: 3, reps: '12',    restTime: '60 sec' },
    ]},
    { day: 'Wednesday', focus: 'Legs',               exercises: [
      { name: 'Squats',          sets: 4, reps: '8-10',  restTime: '120 sec' },
      { name: 'Leg Press',       sets: 3, reps: '10-12', restTime: '90 sec' },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', restTime: '90 sec' },
      { name: 'Calf Raises',     sets: 4, reps: '15-20', restTime: '60 sec' },
    ]},
    { day: 'Thursday',  focus: 'Shoulders',          exercises: [
      { name: 'Overhead Press',  sets: 4, reps: '8-10',  restTime: '90 sec' },
      { name: 'Lateral Raises',  sets: 3, reps: '12-15', restTime: '60 sec' },
      { name: 'Front Raises',    sets: 3, reps: '12',    restTime: '60 sec' },
      { name: 'Face Pulls',      sets: 3, reps: '15',    restTime: '60 sec' },
    ]},
    { day: 'Friday',    focus: 'Arms',               exercises: [
      { name: 'Barbell Curls',   sets: 4, reps: '10-12', restTime: '60 sec' },
      { name: 'Hammer Curls',    sets: 3, reps: '12',    restTime: '60 sec' },
      { name: 'Tricep Pushdown', sets: 4, reps: '12-15', restTime: '60 sec' },
      { name: 'Skull Crushers',  sets: 3, reps: '10',    restTime: '75 sec' },
    ]},
    { day: 'Saturday',  focus: 'Cardio',             exercises: [
      { name: 'Light Jog',       sets: 1, reps: '20 min', restTime: '-' },
      { name: 'Core Work',       sets: 3, reps: '15',    restTime: '45 sec' },
    ]},
    { day: 'Sunday',    focus: 'Rest Day',           exercises: [] },
  ],
  maintenance: [
    { day: 'Monday',    focus: 'Full Body Strength', exercises: [
      { name: 'Squats',          sets: 3, reps: '12',    restTime: '60 sec' },
      { name: 'Push-ups',        sets: 3, reps: '15',    restTime: '60 sec' },
      { name: 'Dumbbell Rows',   sets: 3, reps: '12',    restTime: '60 sec' },
    ]},
    { day: 'Tuesday',   focus: 'Cardio',             exercises: [
      { name: 'Moderate Run',    sets: 1, reps: '25 min', restTime: '-' },
      { name: 'Jump Rope',       sets: 2, reps: '5 min',  restTime: '60 sec' },
    ]},
    { day: 'Wednesday', focus: 'Upper Body',         exercises: [
      { name: 'Bench Press',     sets: 3, reps: '12',    restTime: '75 sec' },
      { name: 'Pull-ups',        sets: 3, reps: '10',    restTime: '75 sec' },
      { name: 'Shoulder Press',  sets: 3, reps: '12',    restTime: '60 sec' },
    ]},
    { day: 'Thursday',  focus: 'Lower Body',         exercises: [
      { name: 'Lunges',          sets: 3, reps: '12',    restTime: '60 sec' },
      { name: 'Leg Curls',       sets: 3, reps: '12',    restTime: '60 sec' },
      { name: 'Calf Raises',     sets: 3, reps: '15',    restTime: '45 sec' },
    ]},
    { day: 'Friday',    focus: 'Core & Flexibility', exercises: [
      { name: 'Plank',           sets: 3, reps: '45 sec', restTime: '60 sec' },
      { name: 'Russian Twists',  sets: 3, reps: '20',    restTime: '45 sec' },
      { name: 'Yoga Stretching', sets: 1, reps: '20 min', restTime: '-' },
    ]},
    { day: 'Saturday',  focus: 'Cardio',             exercises: [
      { name: 'Cycling',         sets: 1, reps: '30 min', restTime: '-' },
    ]},
    { day: 'Sunday',    focus: 'Rest Day',           exercises: [] },
  ],
};

// @desc    Get or generate workout plan for user
// @route   GET /api/workout
// @access  Private
const getWorkoutPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let workout = await Workout.findOne({ user: req.user._id });

    // If no plan exists, generate one based on the user's fitness goal
    if (!workout) {
      const plan = workoutPlans[user.fitnessGoal] || workoutPlans.maintenance;
      workout = await Workout.create({
        user:        req.user._id,
        fitnessGoal: user.fitnessGoal,
        weekPlan:    plan,
      });
    }

    res.json(workout);
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Regenerate workout plan (when user changes fitness goal)
// @route   POST /api/workout/generate
// @access  Private
const generateWorkoutPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const plan = workoutPlans[user.fitnessGoal] || workoutPlans.maintenance;

    // Delete old plan and create new one
    await Workout.findOneAndDelete({ user: req.user._id });
    const workout = await Workout.create({
      user:        req.user._id,
      fitnessGoal: user.fitnessGoal,
      weekPlan:    plan,
    });

    res.json(workout);
  } catch (error) {
    console.error('Generate workout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark a workout day as completed
// @route   PUT /api/workout/complete/:dayIndex
// @access  Private
const markWorkoutComplete = async (req, res) => {
  try {
    const { dayIndex } = req.params;
    const workout = await Workout.findOne({ user: req.user._id });

    if (!workout) return res.status(404).json({ message: 'Workout plan not found' });

    // Mark the specific day as completed
    workout.weekPlan[dayIndex].completed   = true;
    workout.weekPlan[dayIndex].completedAt = new Date();
    await workout.save();

    // Update user streak
    const user = await User.findById(req.user._id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastDate = user.lastWorkoutDate ? new Date(user.lastWorkoutDate) : null;

    if (lastDate) {
      lastDate.setHours(0, 0, 0, 0);
      const diff = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        user.streak += 1; // consecutive day
      } else if (diff > 1) {
        user.streak = 1;  // streak broken
      }
    } else {
      user.streak = 1; // first workout
    }

    user.lastWorkoutDate = new Date();
    await user.save();

    res.json({ message: 'Workout marked as completed', streak: user.streak, workout });
  } catch (error) {
    console.error('Mark complete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getWorkoutPlan, generateWorkoutPlan, markWorkoutComplete };
