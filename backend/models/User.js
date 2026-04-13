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
      required: [function() { return !this.isGoogleAuth; }, 'Please enter a password'],
      minlength: 6,
    },
    isGoogleAuth: {
      type: Boolean,
      default: false,
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
    waterGoal: { type: Number, default: 2.5 }, // liters per day
    caloriesGoal: { type: Number, default: 2000 },
    mealTimes: {
      breakfast: { type: String, default: '08:00' },
      lunch: { type: String, default: '13:00' },
      dinner: { type: String, default: '19:00' },
      snacks: { type: String, default: '16:00' }
    },
    workoutTime: { type: String, default: '17:00' },
    // Streak tracking
    streak: { type: Number, default: 0 },
    lastWorkoutDate: { type: Date, default: null },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Auto-assign schedule timings based on fitnessGoal
userSchema.pre('save', function (next) {
  // If the user's focus changed, the AI immediately overrides schedules
  if (this.isModified('fitnessGoal') || this.isNew) {
    if (this.fitnessGoal === 'weight_loss') {
      this.workoutTime = '06:30';
      this.mealTimes = { breakfast: '08:00', lunch: '12:30', dinner: '18:30', snacks: '16:00' };
    } else if (this.fitnessGoal === 'muscle_gain') {
      this.workoutTime = '19:00';
      this.mealTimes = { breakfast: '07:30', lunch: '13:00', dinner: '20:00', snacks: '17:00' };
    } else { // maintenance
      this.workoutTime = '17:00';
      this.mealTimes = { breakfast: '08:00', lunch: '13:00', dinner: '19:30', snacks: '16:30' };
    }
  }
  next();
});

// Hash password before saving to database
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
