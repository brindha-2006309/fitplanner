// src/pages/WorkoutPlanner.js - Weekly workout plan page

import React, { useEffect, useState } from 'react';
import { getWorkoutPlan, generateWorkoutPlan, markWorkoutComplete } from '../services/api';
import WorkoutCard from '../components/WorkoutCard';

const WorkoutPlanner = () => {
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState('');

  const fetchPlan = async () => {
    try {
      const { data } = await getWorkoutPlan();
      setWorkout(data);
    } catch (err) {
      console.error('Fetch workout error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlan(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await generateWorkoutPlan();
      setWorkout(data);
      setMessage('✅ New workout plan generated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Generate error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkComplete = async (dayIndex) => {
    try {
      const { data } = await markWorkoutComplete(dayIndex);
      setWorkout(data.workout);
      setMessage(`🔥 Workout complete! Streak: ${data.streak} day(s)`);
      setTimeout(() => setMessage(''), 4000);
    } catch (err) {
      console.error('Mark complete error:', err);
    }
  };

  if (loading) {
    return <div className="text-orange-400 text-center mt-20 animate-pulse text-xl">Loading workout plan...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">💪 Weekly Workout Plan</h1>
          <p className="text-slate-400 text-sm mt-1">
            Goal: <span className="text-orange-400 capitalize">{workout?.fitnessGoal?.replace('_', ' ')}</span>
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary disabled:opacity-60"
        >
          {generating ? 'Generating...' : '🔄 Regenerate Plan'}
        </button>
      </div>

      {/* Notification message */}
      {message && (
        <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* Workout cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {workout?.weekPlan?.map((day, index) => (
          <WorkoutCard
            key={index}
            day={day.day}
            focus={day.focus}
            exercises={day.exercises}
            completed={day.completed}
            onMarkComplete={() => handleMarkComplete(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutPlanner;
