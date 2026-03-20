// src/services/api.js - Centralized Axios API service

import axios from 'axios';

// Base URL points to our Express backend
const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ─── Request Interceptor ──────────────────────────────────────────────────────
// Automatically attach the JWT token to every request if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────────
// Handle 401 errors globally (auto logout on token expiry)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth APIs ────────────────────────────────────────────────────────────────
export const registerUser = (data)  => API.post('/auth/register', data);
export const loginUser    = (data)  => API.post('/auth/login',    data);
export const getMe        = ()      => API.get('/auth/me');

// ─── Profile APIs ─────────────────────────────────────────────────────────────
export const getProfile    = ()     => API.get('/profile');
export const updateProfile = (data) => API.put('/profile', data);

// ─── Workout APIs ─────────────────────────────────────────────────────────────
export const getWorkoutPlan      = ()          => API.get('/workout');
export const generateWorkoutPlan = ()          => API.post('/workout/generate');
export const markWorkoutComplete = (dayIndex)  => API.put(`/workout/complete/${dayIndex}`);

// ─── Diet APIs ────────────────────────────────────────────────────────────────
export const getDietPlan    = ()  => API.get('/diet');
export const generateDiet   = ()  => API.post('/diet/generate');
export const markDietMealComplete = (mealType) => API.put(`/diet/complete/${mealType}`);

// ─── Progress APIs ────────────────────────────────────────────────────────────
export const getProgress      = ()     => API.get('/progress');
export const logProgress      = (data) => API.post('/progress', data);
export const updateWaterIntake = (data) => API.put('/progress/water', data);
export const getTodayProgress = ()     => API.get('/progress/today');

// ─── AI Chat API ──────────────────────────────────────────────────────────────
export const askAI = (data) => API.post('/ai/chat', data);

export default API;
