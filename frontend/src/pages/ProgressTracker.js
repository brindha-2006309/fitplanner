// src/pages/ProgressTracker.js - Progress tracking with charts and log form

import React, { useEffect, useState } from 'react';
import { getProgress, logProgress } from '../services/api';
import ProgressChart from '../components/ProgressChart';
import { LineChart, PenSquare, Scale, Flame, FileText, CheckCircle, Calendar, Droplets } from 'lucide-react';

const ProgressTracker = () => {
  const [progress, setProgress]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState({ weight: '', caloriesBurned: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage]     = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const { data } = await getProgress();
      setProgress(data);
    } catch (err) {
      console.error('Fetch progress error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await logProgress({
        weight:         parseFloat(form.weight) || undefined,
        caloriesBurned: parseFloat(form.caloriesBurned) || 0,
        notes:          form.notes,
        workoutDone:    true,
      });
      setMessage('✅ Progress logged successfully!');
      setForm({ weight: '', caloriesBurned: '', notes: '' });
      await fetchProgress();
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error('Log progress error:', err);
      setMessage('❌ Failed to log progress.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="text-orange-400 text-center mt-20 animate-pulse text-xl">Loading progress...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in-up md:max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
          <LineChart className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400 tracking-tight">Progress Tracker</h1>
          <p className="text-slate-400 font-medium">Track your weight, calories burned, and milestones</p>
        </div>
      </div>

      {/* Log form */}
      <div className="card bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50">
        <div className="flex items-center gap-2 mb-6">
          <span className="bg-orange-500/20 text-orange-400 p-2 rounded-lg"><PenSquare className="w-5 h-5" /></span>
          <h2 className="text-white font-bold text-xl">Log Today's Progress</h2>
        </div>
        
        {message && (
          <div className={`px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2 border shadow-lg ${
            message.startsWith('✅')
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-emerald-500/5'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400 shadow-rose-500/5'
          }`}>
            <span className="shrink-0">{message.startsWith('✅') ? <CheckCircle className="w-4 h-4"/> : '⚠️'}</span>
            {message.replace('✅ ', '').replace('❌ ', '')}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="text-slate-300 text-sm font-semibold block mb-2 flex items-center gap-1.5 ">
              <Scale className="w-4 h-4 text-slate-400" /> Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
              placeholder="e.g. 72.5"
              className="input-field bg-slate-900/50"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-semibold block mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-slate-400" /> Calories Burned
            </label>
            <input
              type="number"
              value={form.caloriesBurned}
              onChange={(e) => setForm({ ...form, caloriesBurned: e.target.value })}
              placeholder="e.g. 350"
              className="input-field bg-slate-900/50"
            />
          </div>
          <div>
            <label className="text-slate-300 text-sm font-semibold block mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-slate-400" /> Notes
            </label>
            <input
              type="text"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="How did you feel?"
              className="input-field bg-slate-900/50"
            />
          </div>
          <div className="md:col-span-3 pt-2 w-full flex justify-end">
            <button type="submit" disabled={submitting} className="btn-primary py-3 px-8 disabled:opacity-60 flex items-center gap-2 shadow-orange-500/20">
              {submitting ? 'Saving...' : <><CheckCircle className="w-5 h-5" /> Save Progress</>}
            </button>
          </div>
        </form>
      </div>

      {/* Progress Chart */}
      <ProgressChart data={progress} />

      {/* History table */}
      {progress.length > 0 && (
        <div className="card overflow-x-auto bg-slate-800/50 border-slate-700/50">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg"><Calendar className="w-5 h-5" /></span>
            <h2 className="text-white font-bold text-xl">History <span className="text-slate-500 text-sm font-normal ml-2">(Last 30 Days)</span></h2>
          </div>
          
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-700/50 text-slate-400 bg-slate-900/30">
                <th className="py-3 px-4 font-semibold rounded-tl-lg">Date</th>
                <th className="py-3 px-4 font-semibold">Weight</th>
                <th className="py-3 px-4 font-semibold">Cal. Burned</th>
                <th className="py-3 px-4 font-semibold">Water</th>
                <th className="py-3 px-4 font-semibold">Workout</th>
                <th className="py-3 px-4 font-semibold rounded-tr-lg">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {progress.map((entry) => (
                <tr key={entry._id} className="text-slate-300 hover:bg-slate-700/20 transition-colors">
                  <td className="py-3 px-4 font-medium">{new Date(entry.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</td>
                  <td className="py-3 px-4">{entry.weight ? <span className="text-blue-400 font-medium">{entry.weight} kg</span> : <span className="text-slate-600">—</span>}</td>
                  <td className="py-3 px-4">{entry.caloriesBurned ? <span className="text-orange-400 font-medium">{entry.caloriesBurned} <span className="text-xs">kcal</span></span> : <span className="text-slate-600">—</span>}</td>
                  <td className="py-3 px-4 flex items-center gap-1.5"><Droplets className="w-4 h-4 text-cyan-500" /> <span className="font-medium text-cyan-50">{entry.waterIntake}</span></td>
                  <td className="py-3 px-4">
                    {entry.workoutDone ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                          <CheckCircle className="w-3 h-3" /> Done
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-500/10 text-slate-400 border border-slate-500/20 text-xs font-semibold">
                          Skipped
                        </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 truncate max-w-[150px]" title={entry.notes}>{entry.notes || <span className="text-slate-600">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
