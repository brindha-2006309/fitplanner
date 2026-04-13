// src/pages/DietPlanner.js - Daily diet plan page

import React, { useEffect, useState } from 'react';
import { getDietPlan, generateDiet, markDietMealComplete, getProfile, updateProfile } from '../services/api';
import DietCard from '../components/DietCard';

const DietPlanner = () => {
  const [diet, setDiet]         = useState(null);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage]   = useState('');

  const fetchDiet = async () => {
    try {
      const [dietRes, profRes] = await Promise.all([getDietPlan(), getProfile()]);
      setDiet(dietRes.data);
      setProfile(profRes.data);
    } catch (err) {
      console.error('Fetch diet error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDiet(); }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const { data } = await generateDiet();
      setDiet(data);
      setMessage('✅ Diet plan refreshed!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Generate diet error:', err);
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkComplete = async (mealType) => {
    try {
      const { data } = await markDietMealComplete(mealType);
      setDiet(data);
      setMessage(`✅ ${mealType.charAt(0).toUpperCase() + mealType.slice(1)} marked as completed!`);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Mark complete error:', err);
    }
  };

  const handleTimeChange = async (meal, time) => {
    // Only update locally for instant UI
    const updatedMeals = { ...profile.mealTimes, [meal]: time };
    setProfile(p => ({ ...p, mealTimes: updatedMeals }));
    try {
      await updateProfile({ mealTimes: updatedMeals });
    } catch(err) {
      console.error('Profile update err', err);
    }
  };

  if (loading) {
    return <div className="text-orange-400 text-center mt-20 animate-pulse text-xl">Loading diet plan...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">🥗 Daily Diet Plan</h1>
          <p className="text-slate-400 text-sm mt-1">
            Goal: <span className="text-orange-400 capitalize">{diet?.fitnessGoal?.replace('_', ' ')}</span>
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="btn-primary disabled:opacity-60"
        >
          {generating ? 'Generating...' : '🔄 Refresh Plan'}
        </button>
      </div>

      {message && (
        <div className="bg-green-600/20 border border-green-600 text-green-400 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* Summary bar */}
      {diet && (
        <div className="card">
          <h2 className="text-white font-bold text-lg mb-4">📊 Daily Totals</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-orange-600/20 rounded-xl p-4">
              <p className="text-orange-400 font-extrabold text-3xl">{diet.totalCalories}</p>
              <p className="text-slate-400 text-sm mt-1">Total Calories</p>
            </div>
            <div className="bg-blue-600/20 rounded-xl p-4">
              <p className="text-blue-400 font-extrabold text-3xl">{diet.totalProtein}g</p>
              <p className="text-slate-400 text-sm mt-1">Protein</p>
            </div>
            <div className="bg-green-600/20 rounded-xl p-4">
              <p className="text-green-400 font-extrabold text-3xl">{diet.totalCarbs}g</p>
              <p className="text-slate-400 text-sm mt-1">Carbohydrates</p>
            </div>
          </div>
        </div>
      )}

      {/* Meal cards */}
      {diet && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
            <DietCard 
              key={meal} 
              mealType={meal} 
              meal={diet[meal]} 
              savedTime={profile?.mealTimes?.[meal]}
              onTimeChange={(time) => handleTimeChange(meal, time)}
              onMarkComplete={() => handleMarkComplete(meal)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DietPlanner;
