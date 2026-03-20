// src/App.js - Main application with routing configuration

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page imports
import Home         from './pages/Home';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import WorkoutPlanner  from './pages/WorkoutPlanner';
import DietPlanner     from './pages/DietPlanner';
import ProgressTracker from './pages/ProgressTracker';
import BMICalculator   from './pages/BMICalculator';
import ExerciseLibrary from './pages/ExerciseLibrary';
import Profile         from './pages/Profile';

// Component imports
import Navbar  from './components/Navbar';
import Sidebar from './components/Sidebar';

// ─── Private Route Wrapper ─────────────────────────────────────────────────────
// Redirects to /login if no token found in localStorage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
};

// ─── Layout for authenticated pages (with Sidebar) ────────────────────────────
const AuthLayout = ({ children }) => (
  <div className="flex h-screen w-full bg-slate-900 overflow-hidden">
    <Sidebar />
    <div className="flex-1 flex flex-col h-full overflow-hidden relative">
      <Navbar className="flex-shrink-0" />
      <main className="flex-1 p-6 overflow-y-auto custom-scrollbar relative">
        {children}
      </main>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/"         element={<Home />} />
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes - require login */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <AuthLayout><Dashboard /></AuthLayout>
          </PrivateRoute>
        } />
        <Route path="/workout" element={
          <PrivateRoute>
            <AuthLayout><WorkoutPlanner /></AuthLayout>
          </PrivateRoute>
        } />
        <Route path="/diet" element={
          <PrivateRoute>
            <AuthLayout><DietPlanner /></AuthLayout>
          </PrivateRoute>
        } />
        <Route path="/progress" element={
          <PrivateRoute>
            <AuthLayout><ProgressTracker /></AuthLayout>
          </PrivateRoute>
        } />
        <Route path="/bmi" element={
          <PrivateRoute>
            <AuthLayout><BMICalculator /></AuthLayout>
          </PrivateRoute>
        } />
        <Route path="/exercises" element={
          <PrivateRoute>
            <AuthLayout><ExerciseLibrary /></AuthLayout>
          </PrivateRoute>
        } />
        <Route path="/profile" element={
          <PrivateRoute>
            <AuthLayout><Profile /></AuthLayout>
          </PrivateRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
