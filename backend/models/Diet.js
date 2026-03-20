// models/Diet.js - Daily diet plan schema

const mongoose = require('mongoose');

// Schema for a single meal
const mealSchema = new mongoose.Schema({
  name:         { type: String, required: true }, // e.g., "Oatmeal with Berries"
  calories:     { type: Number, required: true },
  protein:      { type: Number, required: true }, // in grams
  carbohydrates:{ type: Number, required: true }, // in grams
  fat:          { type: Number, default: 0 },      // in grams
  items:        [{ type: String }],                // list of food items
  completed:    { type: Boolean, default: false }, // Track meal completion
});

const dietSchema = new mongoose.Schema(
  {
    user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fitnessGoal: { type: String, required: true },
    breakfast:   mealSchema,
    lunch:       mealSchema,
    dinner:      mealSchema,
    snacks:      mealSchema,
    totalCalories: { type: Number, default: 0 },
    totalProtein:  { type: Number, default: 0 },
    totalCarbs:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Diet', dietSchema);
