// models/Progress.js - Progress tracking schema (weight, calories, water, workouts)

const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema(
  {
    user:           { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date:           { type: Date, default: Date.now },
    weight:         { type: Number, default: null },      // in kg
    caloriesBurned: { type: Number, default: 0 },
    waterIntake:    { type: Number, default: 0 },         // glasses consumed today
    workoutDone:    { type: Boolean, default: false },
    notes:          { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Progress', progressSchema);
