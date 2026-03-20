// src/pages/Profile.js - User profile setup and editing page

import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { User, Activity, Flame, Droplets, Target, Scale, Save, CheckCircle, AlertTriangle } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', age: '', gender: '', height: '', weight: '',
    fitnessGoal: 'maintenance', waterGoal: 8, caloriesGoal: 2000,
  });
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [message, setMessage]     = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await getProfile();
        setForm({
          name:         data.name         || '',
          age:          data.age          || '',
          gender:       data.gender       || '',
          height:       data.height       || '',
          weight:       data.weight       || '',
          fitnessGoal:  data.fitnessGoal  || 'maintenance',
          waterGoal:    data.waterGoal    || 8,
          caloriesGoal: data.caloriesGoal || 2000,
        });
      } catch (err) {
        console.error('Profile fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await updateProfile(form);
      // Update stored user info
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...storedUser, name: data.name, fitnessGoal: data.fitnessGoal }));
      setMessage('✅ Profile updated successfully!');
      setTimeout(() => {
        setMessage('');
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setMessage('❌ Failed to update profile.');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  // Calculate BMI dynamically
  const bmi = form.height && form.weight
    ? (parseFloat(form.weight) / ((parseFloat(form.height) / 100) ** 2)).toFixed(1)
    : null;

  if (loading) {
    return <div className="text-orange-400 text-center mt-20 animate-pulse text-xl">Loading profile...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl shadow-lg shadow-indigo-500/20">
          <User className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 tracking-tight">My Profile</h1>
          <p className="text-slate-400 font-medium">Manage your personal information and fitness goals</p>
        </div>
      </div>

      {message && (
        <div className={`px-4 py-4 rounded-xl text-sm flex items-center gap-3 border shadow-lg ${
          message.startsWith('✅')
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5'
            : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/5'
        }`}>
          {message.startsWith('✅') ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
          <span className="font-medium text-base">{message.replace('✅ ', '').replace('❌ ', '')}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column: BMI and Quick stats */}
        <div className="space-y-6">
           {/* BMI Preview */}
           {bmi && (
             <div className="card bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/20 relative overflow-hidden group">
               <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
               <div className="flex items-center gap-4 relative z-10">
                 <div className="p-3 bg-indigo-500/20 rounded-xl shadow-inner">
                   <Scale className="w-8 h-8 text-indigo-400" />
                 </div>
                 <div>
                   <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Current BMI</p>
                   <p className="text-indigo-400 font-black text-3xl tracking-tighter drop-shadow-sm">{bmi}</p>
                 </div>
               </div>
             </div>
           )}
           
           <div className="card bg-slate-800/40 border-slate-700/50">
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Target className="w-4 h-4 text-orange-400" /> Current Goal
             </h3>
             <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/30">
               <span className="text-orange-400 font-bold uppercase tracking-wide text-sm">
                 {form.fitnessGoal.replace('_', ' ')}
               </span>
               <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                 Based on your current goal, we aim for <strong className="text-slate-300">{form.caloriesGoal} kcal</strong> daily and <strong className="text-slate-300">{form.waterGoal} glasses</strong> of water.
               </p>
             </div>
           </div>
        </div>

        {/* Right column: Main Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 card bg-slate-800/60 border-slate-700/50 space-y-8">
          
          {/* Personal Info */}
          <div>
            <h2 className="text-white font-bold text-lg border-b border-slate-700/50 pb-3 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" /> Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-slate-300 text-sm font-semibold block mb-2">Full Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="John Doe" className="input-field bg-slate-900/50 focus:border-indigo-500 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-semibold block mb-2">Age</label>
                <input type="number" name="age" value={form.age} onChange={handleChange} placeholder="25" min="10" max="100" className="input-field bg-slate-900/50 focus:border-indigo-500 focus:ring-indigo-500/20" />
              </div>
              <div>
                <label className="text-slate-300 text-sm font-semibold block mb-2">Gender</label>
                <select name="gender" value={form.gender} onChange={handleChange} className="input-field bg-slate-900/50 focus:border-indigo-500 focus:ring-indigo-500/20 cursor-pointer">
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-300 text-sm font-semibold block mb-2">Height <span className="text-slate-500 font-normal">(cm)</span></label>
                  <input type="number" name="height" value={form.height} onChange={handleChange} placeholder="175" min="100" max="250" className="input-field bg-slate-900/50 focus:border-indigo-500 focus:ring-indigo-500/20" />
                </div>
                <div>
                  <label className="text-slate-300 text-sm font-semibold block mb-2">Weight <span className="text-slate-500 font-normal">(kg)</span></label>
                  <input type="number" step="0.1" name="weight" value={form.weight} onChange={handleChange} placeholder="70" min="20" max="300" className="input-field bg-slate-900/50 focus:border-indigo-500 focus:ring-indigo-500/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Goals */}
          <div>
            <h2 className="text-white font-bold text-lg border-b border-slate-700/50 pb-3 mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-400" /> Health Goals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div className="md:col-span-2">
                <label className="text-slate-300 text-sm font-semibold block mb-2">Primary Fitness Goal</label>
                <select name="fitnessGoal" value={form.fitnessGoal} onChange={handleChange} className="input-field bg-slate-900/50 focus:border-orange-500 focus:ring-orange-500/20 cursor-pointer py-3 text-base">
                  <option value="weight_loss">🔥 Weight Loss (Caloric Deficit)</option>
                  <option value="muscle_gain">💪 Muscle Gain (Caloric Surplus)</option>
                  <option value="maintenance">⚖️ Maintenance (Maintain Current)</option>
                </select>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-semibold block mb-2 flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-400" /> Daily Water Goal</label>
                <div className="relative">
                  <input type="number" name="waterGoal" value={form.waterGoal} onChange={handleChange} min="1" max="20" className="input-field pr-20 bg-slate-900/50 focus:border-cyan-500 focus:ring-cyan-500/20" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">glasses</span>
                </div>
              </div>
              <div>
                <label className="text-slate-300 text-sm font-semibold block mb-2 flex items-center gap-1.5"><Flame className="w-4 h-4 text-orange-400" /> Daily Calorie Target</label>
                <div className="relative">
                  <input type="number" name="caloriesGoal" value={form.caloriesGoal} onChange={handleChange} min="800" max="5000" className="input-field pr-16 bg-slate-900/50 focus:border-orange-500 focus:ring-orange-500/20" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm pointer-events-none">kcal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-700/50">
            <button type="submit" disabled={saving} className="btn-primary w-full py-4 text-lg font-bold disabled:opacity-60 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 shadow-indigo-500/20">
              {saving ? 'Saving Changes...' : <><Save className="w-5 h-5" /> Save Profile</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
