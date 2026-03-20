// src/components/WaterTracker.js - Daily water intake tracker with progress bar

import React, { useState } from 'react';
import { updateWaterIntake } from '../services/api';
import { Droplets, Plus, Minus } from 'lucide-react';

const WaterTracker = ({ current = 0, goal = 8, onUpdate }) => {
  const [glasses, setGlasses] = useState(current);
  const [loading, setLoading] = useState(false);

  const percentage = Math.min((glasses / goal) * 100, 100);

  const handleAddGlass = async () => {
    if (glasses >= goal) return;
    const newCount = glasses + 1;
    setGlasses(newCount);
    setLoading(true);
    try {
      await updateWaterIntake({ waterIntake: newCount });
      if (onUpdate) onUpdate(newCount);
    } catch (err) {
      console.error('Failed to update water intake:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveGlass = async () => {
    if (glasses <= 0) return;
    const newCount = glasses - 1;
    setGlasses(newCount);
    setLoading(true);
    try {
      await updateWaterIntake({ waterIntake: newCount });
      if (onUpdate) onUpdate(newCount);
    } catch (err) {
      console.error('Failed to update water intake:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 relative overflow-hidden group">
      {/* Decorative background glass */}
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-400 p-2 rounded-lg">
            <Droplets className="w-5 h-5" />
          </span>
          Water Tracker
        </h3>
        <span className="text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 shadow-inner">
          {glasses} <span className="text-sm font-medium text-cyan-500/80">/ {goal}</span>
        </span>
      </div>

      {/* Glasses visual representation */}
      <div className="flex flex-wrap gap-3 mb-6 relative z-10 justify-center">
        {Array.from({ length: goal }).map((_, i) => (
          <button
            key={i}
            onClick={i < glasses ? handleRemoveGlass : handleAddGlass}
            disabled={loading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-inner ${
              i < glasses 
                ? 'bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow-cyan-500/30 scale-100 hover:scale-110 hover:shadow-cyan-500/50' 
                : 'bg-slate-800/80 border border-slate-700 text-slate-600 scale-95 hover:scale-100 hover:bg-slate-700/80 hover:border-slate-600'
            }`}
            title={i < glasses ? 'Click to remove' : 'Click to add'}
          >
            <Droplets className={`w-5 h-5 ${i < glasses ? 'fill-white/20' : ''}`} />
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative z-10">
        <div className="bg-slate-800/80 rounded-full h-4 overflow-hidden shadow-inner border border-slate-700/50 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
             {/* Animated shimmer effect on progress bar */}
             <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>

        <div className="flex justify-between text-xs font-medium text-slate-500 mt-2 px-1">
          <span>0%</span>
          <span className={`transition-colors duration-300 ${percentage >= 100 ? 'text-emerald-400 font-bold scale-110' : 'text-cyan-400'}`}>
            {percentage >= 100 ? '🎉 Daily Goal Reached!' : `${percentage.toFixed(0)}% Hydrated`}
          </span>
          <span>100%</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-6 relative z-10">
        <button
          onClick={handleAddGlass}
          disabled={glasses >= goal || loading}
          className="flex-1 btn-primary py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
        <button
          onClick={handleRemoveGlass}
          disabled={glasses <= 0 || loading}
          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 rounded-xl border border-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
        >
          <Minus className="w-4 h-4" /> Remove
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
