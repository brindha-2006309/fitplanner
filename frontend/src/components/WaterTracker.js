import React, { useState, useEffect } from 'react';
import { updateWaterIntake } from '../services/api';
import { Droplets, Plus, Minus, Sunrise, Sun, Moon } from 'lucide-react';

const WaterTracker = ({ todayLog, goal = 2.5, onUpdate }) => {
  const [water, setWater] = useState({
    morning: todayLog?.waterMorning || 0,
    afternoon: todayLog?.waterAfternoon || 0,
    evening: todayLog?.waterEvening || 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (todayLog) {
      setWater({
        morning: todayLog.waterMorning || 0,
        afternoon: todayLog.waterAfternoon || 0,
        evening: todayLog.waterEvening || 0
      });
    }
  }, [todayLog]);

  const total = parseFloat((water.morning + water.afternoon + water.evening).toFixed(2));
  const percentage = Math.min((total / goal) * 100, 100);

  const handleUpdate = async (period, amount) => {
    const newVal = Math.max(0, water[period] + amount);
    const updatedWater = { ...water, [period]: newVal };
    setWater(updatedWater);
    
    setLoading(true);
    try {
      const totalIntake = updatedWater.morning + updatedWater.afternoon + updatedWater.evening;
      await updateWaterIntake({
        waterIntake: parseFloat(totalIntake.toFixed(2)),
        waterMorning: updatedWater.morning,
        waterAfternoon: updatedWater.afternoon,
        waterEvening: updatedWater.evening
      });
      if (onUpdate) onUpdate(totalIntake);
    } catch (err) {
      console.error('Failed to update water intake', err);
    } finally {
      setLoading(false);
    }
  };

  const periods = [
    { id: 'morning', label: 'Morning', icon: <Sunrise className="w-4 h-4 text-amber-500" /> },
    { id: 'afternoon', label: 'Afternoon', icon: <Sun className="w-4 h-4 text-yellow-500" /> },
    { id: 'evening', label: 'Evening', icon: <Moon className="w-4 h-4 text-indigo-400" /> }
  ];

  return (
    <div className="card bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700/50 relative overflow-hidden group h-full">
      <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors duration-700" />
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <h3 className="text-white font-bold text-xl flex items-center gap-2">
          <span className="bg-cyan-500/20 text-cyan-400 p-2 rounded-lg"><Droplets className="w-5 h-5" /></span>
          Water Tracker
        </h3>
        <span className="text-cyan-400 font-bold bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 shadow-inner">
          {total}L <span className="text-sm font-medium text-cyan-500/80">/ {goal}L</span>
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 relative z-10">
        {periods.map(p => (
          <div key={p.id} className="bg-slate-800/80 border border-slate-700 rounded-xl py-3 px-1 flex flex-col items-center">
            <div className="flex items-center gap-1 mb-2">
               {p.icon} <span className="text-slate-300 text-xs font-semibold">{p.label}</span>
            </div>
            <span className="text-white font-bold text-lg mb-2">{parseFloat(water[p.id].toFixed(2))}L</span>
            <div className="flex gap-2">
               <button onClick={() => handleUpdate(p.id, -0.25)} disabled={loading || water[p.id] <= 0} className="w-7 h-7 rounded bg-slate-700 hover:bg-rose-500 text-white flex items-center justify-center transition-colors disabled:opacity-50"><Minus className="w-4 h-4" /></button>
               <button onClick={() => handleUpdate(p.id, 0.25)} disabled={loading} className="w-7 h-7 rounded bg-slate-700 hover:bg-cyan-500 text-white flex items-center justify-center transition-colors disabled:opacity-50"><Plus className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="bg-slate-800/80 rounded-full h-4 overflow-hidden shadow-inner border border-slate-700/50 p-0.5">
          <div className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 rounded-full transition-all duration-1000 relative overflow-hidden" style={{ width: `${percentage}%` }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
          </div>
        </div>
        <div className="flex justify-between text-xs font-medium text-slate-500 mt-2 px-1">
          <span>0L</span>
          <span className={percentage >= 100 ? 'text-emerald-400 font-bold scale-110' : 'text-cyan-400'}>
            {percentage >= 100 ? '🎉 Goal Reached!' : `${percentage.toFixed(0)}% Hydrated`}
          </span>
          <span>{goal}L</span>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;
