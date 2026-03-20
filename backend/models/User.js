// models/User.js - User schema for authentication and profile data

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please enter your name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please enter your email'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please enter a password'],
      minlength: 6,
    },
    // Profile fields
    age: { type: Number, default: null },
    gender: { type: String, enum: ['male', 'female', 'other', null, ''], default: null },
    height: { type: Number, default: null }, // in cm
    weight: { type: Number, default: null }, // in kg
    fitnessGoal: {
      type: String,
      enum: {
        values: ['weight_loss', 'muscle_gain', 'maintenance'],
        message: 'Invalid fitness goal',
      },
      default: 'maintenance',
    },
    waterGoal: { type: Number, default: 8 }, // glasses per day
    caloriesGoal: { type: Number, default: 2000 },
    // Streak tracking
    streak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
