// src/components/WorkoutCard.js - Card component for displaying a workout day

import React from 'react';
import { PlayCircle, CheckCircle, Clock } from 'lucide-react';

const WorkoutCard = ({ day, focus, exercises, completed, onMarkComplete }) => {
  return (
    <div
      className={`card group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden ${
        completed ? 'border-emerald-500/50 bg-emerald-900/10' : 'border-slate-700/50 hover:border-orange-500/30 bg-slate-800/60'
      }`}
    >
      {/* Decorative gradient for completed state */}
      {completed && <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />}

      {/* Card header */}
      <div className="flex items-center justify-between mb-5 relative z-10">
        <div>
          <h3 className="text-white font-bold text-xl mb-1">{day}</h3>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/50 text-orange-400 text-xs font-semibold border border-slate-700/50">
            {focus}
          </span>
        </div>
        
        {completed ? (
          <button 
            disabled
            className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold text-sm py-2 px-4 rounded-xl shadow-inner flex items-center gap-1.5 cursor-not-allowed transition-all"
          >
            Completed ✔️
          </button>
        ) : focus === 'Rest Day' ? (
          <span className="badge bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1.5 px-3 py-1.5 shadow-inner">
            <span className="text-sm">🛌</span> Rest
          </span>
        ) : (
          <button
            onClick={() => onMarkComplete && onMarkComplete()}
            className="btn-primary text-sm py-2 px-4 shadow-orange-500/20 shadow-lg flex items-center gap-1.5 group-hover:scale-105 transition-all duration-300"
          >
            Mark as Done ✅
          </button>
        )}
      </div>

      {/* Exercise list */}
      {exercises && exercises.length > 0 ? (
        <div className="space-y-3 relative z-10">
          {exercises.map((ex, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-slate-900/40 hover:bg-slate-700/50 border border-slate-700/30 rounded-xl px-4 py-3 transition-colors"
            >
              <div className="flex flex-col">
                <span className="text-slate-200 font-semibold mb-1">{ex.name}</span>
                <div className="flex gap-3 text-slate-400 text-xs font-medium">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-orange-400/90 border border-slate-700">{ex.sets} sets</span>
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-rose-400/90 border border-slate-700">{ex.reps} reps</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                 <span className="flex items-center gap-1.5 text-orange-400 font-mono text-xs bg-orange-500/10 px-2 py-1 rounded-lg border border-orange-500/20">
                   <Clock className="w-3 h-3" /> {ex.restTime}
                 </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-slate-900/30 rounded-xl border border-dashed border-slate-700/50 relative z-10">
          <span className="text-4xl mb-3 block opacity-80">🛌</span>
          <p className="text-slate-400 font-medium">Take a well-deserved rest today!</p>
          <p className="text-slate-500 text-sm mt-1">Recovery is where growth happens.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutCard;
