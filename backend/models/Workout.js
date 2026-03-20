// models/Workout.js - Workout plan schema

const mongoose = require('mongoose');

// Schema for individual exercises inside a workout day
const exerciseSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  sets:     { type: Number, required: true },
  reps:     { type: String, required: true }, // e.g., "12-15"
  restTime: { type: String, required: true }, // e.g., "60 sec"
  notes:    { type: String, default: '' },
});

// Schema for a single workout day
const workoutDaySchema = new mongoose.Schema({
  day:       { type: String, required: true }, // e.g., "Monday"
  focus:     { type: String, required: true }, // e.g., "Chest"
  exercises: [exerciseSchema],
  completed: { type: Boolean, default: false },
  completedAt: { type: Date, default: null },
});

const workoutSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fitnessGoal: { type: String, required: true },
    weekPlan:    [workoutDaySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Workout', workoutSchema);
