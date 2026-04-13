// src/pages/ExerciseLibrary.js - Static exercise library with filter by muscle group

import React, { useState, useRef, useEffect } from 'react';
import { Search, Dumbbell, Activity, Flame, Heart, Zap, Target, ArrowUp, ArrowRight, ArrowDown, ChevronRight, Filter, X } from 'lucide-react';

import exercises from '../data/exercisesData';

const muscles = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Shoulders', 'Arms', 'Full Body'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];


const categoryIcons = {
  Chest: <Dumbbell className="w-6 h-6" />,
  Back: <ArrowUp className="w-6 h-6" />,
  Legs: <Zap className="w-6 h-6" />,
  Core: <Activity className="w-6 h-6" />,
  Shoulders: <ArrowRight className="w-6 h-6" />,
  Arms: <ArrowDown className="w-6 h-6" />,
  'Full Body': <Flame className="w-6 h-6" />
};

const difficultyColors = {
  Beginner:     'bg-green-600/20 text-green-400 border-green-600',
  Intermediate: 'bg-yellow-600/20 text-yellow-400 border-yellow-600',
  Advanced:     'bg-red-600/20 text-red-400 border-red-600',
};

const ExerciseLibrary = () => {
  const [muscleFilter, setMuscleFilter]   = useState('All');
  const [difficultyFilter, setDiffFilter] = useState('All');
  const [search, setSearch]               = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const detailsRef = useRef(null);

  useEffect(() => {
    if (selectedExercise && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedExercise]);

  const filtered = exercises.filter((ex) => {
    const matchMuscle     = muscleFilter === 'All'     || ex.muscle     === muscleFilter;
    const matchDifficulty = difficultyFilter === 'All' || ex.difficulty === difficultyFilter;
    const matchSearch     = ex.name.toLowerCase().includes(search.toLowerCase()) ||
                            ex.muscle.toLowerCase().includes(search.toLowerCase());
    return matchMuscle && matchDifficulty && matchSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-rose-500 to-orange-500 p-3 rounded-2xl shadow-lg shadow-rose-500/20">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400 tracking-tight">Exercise Library</h1>
            <p className="text-slate-400 font-medium">Browse {exercises.length} exercises with descriptions</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card bg-slate-800/60 border-slate-700/50 space-y-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            placeholder="Search by exercise name or muscle group..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-11 bg-slate-900/50 text-lg border-slate-700 focus:border-orange-500 focus:ring-orange-500/20"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Filter className="w-3.5 h-3.5" /> Muscle Group
            </p>
            <div className="flex flex-wrap gap-2">
              {muscles.map((m) => (
                <button
                  key={m}
                  onClick={() => setMuscleFilter(m)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    muscleFilter === m
                      ? 'bg-orange-500 text-white border-orange-400 shadow-lg shadow-orange-500/20 scale-105'
                      : 'bg-slate-900/50 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-3.5 h-3.5" /> Difficulty
            </p>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((d) => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 border ${
                    difficultyFilter === d
                      ? 'bg-rose-500 text-white border-rose-400 shadow-lg shadow-rose-500/20 scale-105'
                      : 'bg-slate-900/50 text-slate-300 border-slate-700 hover:bg-slate-700 hover:border-slate-500'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between text-slate-400 text-sm font-medium px-1">
        <p>{filtered.length} exercise{filtered.length !== 1 ? 's' : ''} found</p>
      </div>

      {/* Exercise cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((ex) => (
          <div key={ex.name} onClick={() => setSelectedExercise(ex)} className="card hover:cursor-pointer group bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80 hover:border-orange-500/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-900/80 text-orange-400 shadow-inner group-hover:bg-gradient-to-br group-hover:from-orange-500 group-hover:to-rose-500 group-hover:text-white transition-colors duration-300">
                  {categoryIcons[ex.muscle] || <Target className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-tight mb-0.5 group-hover:text-orange-300 transition-colors">{ex.name}</h3>
                  <span className="text-orange-500/80 uppercase text-[10px] font-bold tracking-wider">{ex.muscle}</span>
                </div>
              </div>
              <span className={`badge border text-xs font-semibold px-2.5 py-1 ${difficultyColors[ex.difficulty]}`}>
                {ex.difficulty}
              </span>
            </div>
            
            <p className="text-slate-400 text-sm leading-relaxed flex-grow">
              {ex.desc}
            </p>
            
            <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center text-orange-400 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
               View Details <ChevronRight className="w-3 h-3 ml-1" />
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 bg-slate-800/40 border border-dashed border-slate-700/50 rounded-2xl mx-auto max-w-2xl">
          <div className="bg-slate-900/50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-xl font-bold text-white mb-2">No exercises found</p>
          <p className="text-slate-400 font-medium">Try adjusting your filters or search term to see more results.</p>
          <button 
            onClick={() => { setMuscleFilter('All'); setDiffFilter('All'); setSearch(''); }}
            className="mt-6 btn-secondary px-6 py-2"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Exercise Details Modal */}
      {selectedExercise && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg relative my-8">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl text-white shadow-inner">
                  {categoryIcons[selectedExercise.muscle] || <Target className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedExercise.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedExercise.muscle}
                    </span>
                    <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                      {selectedExercise.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedExercise(null)}
                className="text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-1.5 rounded-lg transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {selectedExercise.image && (
                <div className="mb-6 rounded-xl overflow-hidden border border-slate-700/80 shadow-2xl relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent opacity-60 z-10"></div>
                  <img src={selectedExercise.image} alt={selectedExercise.name} className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-700" />
                </div>
              )}
              
              <h3 ref={detailsRef} className="text-white font-bold text-lg mb-3 flex items-center gap-2 relative z-20">
                <Target className="w-5 h-5 text-orange-400" /> Instructions
              </h3>
              
              <ul className="space-y-3">
                {selectedExercise.instructions ? selectedExercise.instructions.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xs font-bold border border-orange-500/30">
                      {idx + 1}
                    </span>
                    <span className="text-slate-300 text-sm leading-relaxed">{step}</span>
                  </li>
                )) : (
                  <li className="text-slate-400 italic">Detailed instructions coming soon!</li>
                )}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-slate-700 flex justify-end">
                <button 
                  onClick={() => setSelectedExercise(null)}
                  className="bg-slate-700 hover:bg-slate-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors border border-slate-600"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ExerciseLibrary;
