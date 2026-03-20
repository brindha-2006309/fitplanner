// src/pages/BMICalculator.js - BMI calculator with category display

import React, { useState } from 'react';
import { Scale, RefreshCw, Info, ArrowDown, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight',   color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20',   icon: <ArrowDown className="w-6 h-6" /> };
  if (bmi < 25)   return { label: 'Normal Weight', color: 'text-emerald-400',bg: 'bg-emerald-500/10',border: 'border-emerald-500/20',icon: <CheckCircle className="w-6 h-6" /> };
  if (bmi < 30)   return { label: 'Overweight',    color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20',  icon: <AlertTriangle className="w-6 h-6" /> };
  return             { label: 'Obese',             color: 'text-rose-400',     bg: 'bg-rose-500/10',   border: 'border-rose-500/20',   icon: <AlertOctagon className="w-6 h-6" /> };
};

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi]       = useState(null);
  const [category, setCategory] = useState(null);

  const calculate = (e) => {
    e.preventDefault();
    if (!height || !weight) return;
    const h = parseFloat(height) / 100; // convert cm to m
    const w = parseFloat(weight);
    const bmiValue = w / (h * h);
    setBmi(bmiValue.toFixed(1));
    setCategory(getBMICategory(bmiValue));
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setCategory(null);
  };

  // BMI scale segments for visual display
  const bmiScale = [
    { label: 'Underweight', range: '< 18.5',    color: 'bg-blue-400' },
    { label: 'Normal',      range: '18.5–24.9', color: 'bg-emerald-400' },
    { label: 'Overweight',  range: '25–29.9',   color: 'bg-amber-400' },
    { label: 'Obese',       range: '≥ 30',      color: 'bg-rose-400' },
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
          <Scale className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">BMI Calculator</h1>
          <p className="text-slate-400 font-medium">Calculate your Body Mass Index to understand your health status</p>
        </div>
      </div>

      {/* Calculator card */}
      <div className="card bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50">
        <form onSubmit={calculate} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">Height (cm)</label>
              <div className="relative">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  required
                  min="100" max="250"
                  className="input-field pr-12 bg-slate-900/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium font-mono text-sm pointer-events-none">cm</span>
              </div>
            </div>
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">Weight (kg)</label>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 70"
                  required
                  min="20" max="300"
                  className="input-field pr-12 bg-slate-900/50"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium font-mono text-sm pointer-events-none">kg</span>
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-2">
            <button type="submit" className="btn-primary flex-1 py-3 text-lg font-bold shadow-indigo-500/20 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500">Calculate BMI</button>
            {bmi && (
              <button type="button" onClick={reset} className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium px-6 rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Result */}
      {bmi && category && (
        <div className={`card border-2 ${category.border} ${category.bg} text-center relative overflow-hidden transition-all duration-500 animate-fade-in-up`}>
          <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none -mt-32 -mr-32 ${category.color.replace('text', 'bg')}`} />
          
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2 relative z-10">Your BMI</p>
          <div className="flex items-center justify-center gap-4 mb-4 relative z-10">
            <p className={`text-7xl font-black ${category.color} tracking-tighter drop-shadow-lg`}>{bmi}</p>
          </div>
          
          <div className={`inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-slate-900/40 border border-slate-700/50 mb-6 relative z-10 shadow-inner`}>
            <span className={`${category.color}`}>{category.icon}</span>
            <span className={`${category.color} font-extrabold text-xl tracking-wide`}>{category.label}</span>
          </div>
          
          <p className="text-slate-300 text-sm max-w-sm mx-auto leading-relaxed relative z-10 font-medium">
            {category.label === 'Normal Weight'
              ? 'Great job! Your weight is in a healthy range. Keep maintaining your active lifestyle!'
              : category.label === 'Underweight'
              ? 'You are below the healthy weight range. Consider consulting a nutritionist to increase calorie intake safely.'
              : category.label === 'Overweight'
              ? 'You are slightly above the healthy range. A balanced diet and regular exercise can help you reach your goals.'
              : 'Your BMI indicates obesity. We recommend consulting a healthcare professional for personalized guidance.'}
          </p>
        </div>
      )}

      {/* BMI Scale Reference */}
      <div className="card bg-slate-800/40 border-slate-700/30">
        <h2 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
           <Info className="w-5 h-5 text-indigo-400" /> BMI Scale Reference
        </h2>
        
        {/* Visual Bar */}
        <div className="h-3 w-full rounded-full flex overflow-hidden mb-6 opacity-80">
          <div className="bg-blue-500 h-full w-[25%]" title="Underweight" />
          <div className="bg-emerald-500 h-full w-[25%]" title="Normal" />
          <div className="bg-amber-500 h-full w-[25%]" title="Overweight" />
          <div className="bg-rose-500 h-full w-[25%]" title="Obese" />
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {bmiScale.map((item) => (
            <div key={item.label} className="text-center p-4 bg-slate-900/40 border border-slate-700/30 rounded-2xl hover:bg-slate-800 transition-colors">
              <div className={`w-3 h-3 ${item.color} rounded-full mx-auto mb-3 shadow-sm`} />
              <p className="text-white text-sm font-bold mb-1">{item.label}</p>
              <p className="text-slate-400 text-xs font-mono">{item.range}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
