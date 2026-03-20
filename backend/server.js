// server.js - Main entry point for the Express backend

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors()); // Allow cross-origin requests from the React frontend
app.use(express.json()); // Parse incoming JSON request bodies

// ─── API Routes ───────────────────────────────────────────────────────────────
const aiRoutes = require("./routes/aiRoutes");

app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/profile',  require('./routes/profileRoutes'));
app.use('/api/workout',  require('./routes/workoutRoutes'));
app.use('/api/diet',     require('./routes/dietRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use("/api/ai", aiRoutes);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Custom Workout & Diet Planner API is running 🚀' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(5000, () => {
  console.log(`✅ Server running on http://localhost:5000`);
});
