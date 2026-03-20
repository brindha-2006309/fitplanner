// src/components/DietCard.js - Card for displaying a single meal

import React from 'react';
import { Sunrise, Sun, Moon, Apple, CheckCircle } from 'lucide-react';

const mealIcons = {
  breakfast: <Sunrise className="w-6 h-6 text-amber-500" />,
  lunch:     <Sun className="w-6 h-6 text-yellow-500" />,
  dinner:    <Moon className="w-6 h-6 text-indigo-400" />,
  snacks:    <Apple className="w-6 h-6 text-rose-500" />,
};

const DietCard = ({ mealType, meal, onMarkComplete }) => {
  if (!meal) return null;

  return (
    <div className="card group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-slate-800/60 border-slate-700/50 hover:bg-slate-800/80">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 border-b border-slate-700/50 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-slate-900/80 shadow-inner group-hover:scale-110 transition-transform">
            {mealIcons[mealType] || <Apple className="w-6 h-6 text-emerald-500" />}
          </div>
          <div>
            <h3 className="text-white font-bold text-lg capitalize tracking-wide">{mealType}</h3>
            <p className="text-slate-400 text-sm font-medium">{meal.name}</p>
          </div>
        </div>

        {/* Completion Button */}
        {meal.completed ? (
          <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-500/20">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Completed</span>
          </div>
        ) : (
          <button 
            onClick={onMarkComplete}
            className="flex items-center gap-1.5 bg-slate-700 hover:bg-emerald-500 text-slate-300 hover:text-white px-3 py-1.5 rounded-lg transition-colors border border-slate-600 hover:border-emerald-500"
          >
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Mark Done</span>
          </button>
        )}
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3 text-center transition-colors group-hover:bg-orange-500/20">
          <p className="text-orange-400 font-bold text-xl leading-none mb-1">{meal.calories}</p>
          <p className="text-orange-400/80 text-[10px] uppercase font-bold tracking-wider">Calories</p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center transition-colors group-hover:bg-blue-500/20">
          <p className="text-blue-400 font-bold text-xl leading-none mb-1">{meal.protein}<span className="text-sm font-medium">g</span></p>
          <p className="text-blue-400/80 text-[10px] uppercase font-bold tracking-wider">Protein</p>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center transition-colors group-hover:bg-emerald-500/20">
          <p className="text-emerald-400 font-bold text-xl leading-none mb-1">{meal.carbohydrates}<span className="text-sm font-medium">g</span></p>
          <p className="text-emerald-400/80 text-[10px] uppercase font-bold tracking-wider">Carbs</p>
        </div>
      </div>

      {/* Food items */}
      {meal.items && meal.items.length > 0 && (
        <div className="space-y-2 pt-2">
          <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">Ingredients</p>
          {meal.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-slate-300 text-sm bg-slate-900/30 rounded-lg py-2 px-3">
              <span className="text-orange-500/80 mt-0.5 text-[10px]">♦</span>
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DietCard;
