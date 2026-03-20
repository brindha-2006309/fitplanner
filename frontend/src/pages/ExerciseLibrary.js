// src/pages/ExerciseLibrary.js - Static exercise library with filter by muscle group

import React, { useState } from 'react';
import { Search, Dumbbell, Activity, Flame, Heart, Zap, Target, ArrowUp, ArrowRight, ArrowDown, ChevronRight, Filter, X } from 'lucide-react';

const exercises = [
  // Beginner/Intermediate
  { 
    name: 'Push-ups', muscle: 'Chest', difficulty: 'Beginner', icon: <Dumbbell className="w-6 h-6" />, 
    desc: 'Classic upper body exercise that targets chest, shoulders, and triceps. Keep your body straight throughout.',
    instructions: ['Keep body straight like a plank', 'Lower slowly until chest is near the floor', 'Push up powerfully', 'Repeat for required reps']
  },
  { 
    name: 'Pull-ups', muscle: 'Back', difficulty: 'Intermediate', icon: <ArrowUp className="w-6 h-6" />, 
    desc: 'Upper body compound exercise. Grip the bar shoulder-width apart and pull until your chin is above the bar.',
    instructions: ['Grip bar slightly wider than shoulder-width', 'Pull body upward until chin clears the bar', 'Lower slowly and under control']
  },
  { 
    name: 'Squats', muscle: 'Legs', difficulty: 'Beginner', icon: <Zap className="w-6 h-6" />, 
    desc: 'King of lower body exercises. Keep your chest up, back straight, and knees aligned with toes.',
    instructions: ['Keep back straight and chest up', 'Bend knees slowly and lower hips', 'Push through heels to return to standing', 'Maintain flat feet throughout']
  },
  { 
    name: 'Deadlift', muscle: 'Back', difficulty: 'Intermediate', icon: <Target className="w-6 h-6" />, 
    desc: 'Full-body compound lift targeting posterior chain. Maintain a neutral spine throughout the movement.',
    instructions: ['Stand with feet hip-width apart under barbell', 'Hinge at hips and keep back perfectly straight', 'Drive through legs to lift weight', 'Squeeze glutes at the top before lowering carefully']
  },
  { 
    name: 'Plank', muscle: 'Core', difficulty: 'Beginner', icon: <Activity className="w-6 h-6" />, 
    desc: 'Isometric core exercise. Keep hips level, core tight, and breathe steadily for the duration.',
    instructions: ['Start in a forearm position', 'Keep body completely straight from head to heels', 'Engage core tightly', 'Hold position steadily for required time']
  },
  { 
    name: 'Bench Press', muscle: 'Chest', difficulty: 'Intermediate', icon: <Dumbbell className="w-6 h-6" />, 
    desc: 'Primary chest builder. Lower the bar to your chest under control and press back up explosively.',
    instructions: ['Lie flat on bench with feet planted', 'Lower bar slowly and under control to mid-chest', 'Press weight straight up powerfully', 'Do not arch back excessively']
  },
  { 
    name: 'Lunges', muscle: 'Legs', difficulty: 'Beginner', icon: <ArrowRight className="w-6 h-6" />, 
    desc: 'Unilateral leg exercise that improves balance and targets quads, glutes, and hamstrings.',
    instructions: ['Take a big step forward with one leg', 'Drop hips until both knees are bent at 90 degrees', 'Push back to starting position powerfully', 'Alternate legs for each rep']
  },
  { 
    name: 'Burpees', muscle: 'Full Body', difficulty: 'Intermediate', icon: <Flame className="w-6 h-6" />, 
    desc: 'High-intensity full body exercise that builds cardiovascular endurance and muscular strength.',
    instructions: ['Drop into a squat position', 'Kick feet back into a plank', 'Do one strict push-up', 'Jump feet back to squat and explode upward into a jump']
  },
  { 
    name: 'Bicycle Crunches', muscle: 'Core', difficulty: 'Beginner', icon: <Zap className="w-6 h-6" />, 
    desc: 'Dynamic core exercise targeting obliques and abs. Alternate touching elbows to opposite knees.',
    instructions: ['Lie on back and lift legs to 90 degrees', 'Alternate touching elbows to opposite knees', 'Use a controlled, pedaling motion', 'Keep lower back pressed into the floor']
  },
  { 
    name: 'Overhead Press', muscle: 'Shoulders', difficulty: 'Intermediate', icon: <ArrowUp className="w-6 h-6" />, 
    desc: 'Pressing the bar from shoulders overhead. Builds deltoids, upper traps, and triceps.',
    instructions: ['Stand tall and brace core tightly', 'Press weight directly overhead until arms lock', 'Lower slowly back to shoulders', 'Keep glutes squeezed for stability']
  },
  { 
    name: 'Barbell Rows', muscle: 'Back', difficulty: 'Intermediate', icon: <Target className="w-6 h-6" />, 
    desc: 'Horizontal pull targeting the lats and middle back. Keep lower back neutral.',
    instructions: ['Hinge forward keeping back completely straight', 'Pull barbell powerfully to lower ribcage', 'Squeeze shoulder blades together at the top', 'Lower weight back down fully under control']
  },
  { 
    name: 'Dips', muscle: 'Arms', difficulty: 'Intermediate', icon: <ArrowDown className="w-6 h-6" />, 
    desc: 'Compound tricep exercise. Lower until elbows reach 90° and press back up.',
    instructions: ['Support body on parallel dip bars', 'Lower slowly until elbows are bent at 90 degrees', 'Press back up to starting position', 'Lean slightly forward to target chest, upright for triceps']
  },
  { 
    name: 'Mountain Climbers', muscle: 'Core', difficulty: 'Beginner', icon: <Activity className="w-6 h-6" />, 
    desc: 'Dynamic cardio and core exercise. Drive knees alternately toward your chest at a rapid pace.',
    instructions: ['Start in a high plank position', 'Drive knees alternately toward chest', 'Maintain a rapid, controlled running pace', 'Keep hips low and back straight']
  },
  { 
    name: 'Jumping Jacks', muscle: 'Full Body', difficulty: 'Beginner', icon: <Heart className="w-6 h-6" />, 
    desc: 'Classic warm-up exercise that elevates heart rate and engages the full body.',
    instructions: ['Stand upright with feet together', 'Jump spreading legs wide and lifting arms overhead', 'Return to start in one continuous motion', 'Maintain a steady, rhythmic pace']
  },
  { 
    name: 'Romanian Deadlift', muscle: 'Legs', difficulty: 'Intermediate', icon: <Target className="w-6 h-6" />, 
    desc: 'Hip-hinge exercise targeting hamstrings and glutes. Keep a slight bend in the knees.',
    instructions: ['Hold weight in front of thighs with slightly bent knees', 'Hinge hips backward slowly until hamstrings deeply stretch', 'Keep back strictly neutral', 'Drive hips forward powerfully to return to standing']
  },
  { 
    name: 'Lateral Raises', muscle: 'Shoulders', difficulty: 'Beginner', icon: <ArrowRight className="w-6 h-6" />, 
    desc: 'Isolation exercise for side deltoids. Raise dumbbells to shoulder level with a slight elbow bend.',
    instructions: ['Hold dumbbells lightly at your sides', 'Raise arms out to sides until parallel to the floor', 'Pause for a second at the top of the movement', 'Lower slowly and continuously under control']
  },
  { 
    name: 'Tricep Dips', muscle: 'Arms', difficulty: 'Beginner', icon: <ArrowDown className="w-6 h-6" />, 
    desc: 'Bodyweight tricep exercise on a chair or bench. Lower body until elbows reach 90°.',
    instructions: ['Sit on edge of a sturdy bench with hands gripping beside hips', 'Slide body off edge and lower until elbows hit 90 degrees', 'Push back up strongly to starting position', 'Keep back close to the bench']
  },
  { 
    name: 'Calf Raises', muscle: 'Legs', difficulty: 'Beginner', icon: <ArrowUp className="w-6 h-6" />, 
    desc: 'Isolation exercise for the calves. Rise on your toes, pause at the top, then lower slowly.',
    instructions: ['Stand tall on the edge of a sturdy step', 'Raise heels as high as possible by flexing calves', 'Hold the squeeze at the very top', 'Lower heels slowly below the level of the step']
  },
  // Advanced Chest
  { 
    name: 'Clap Push-ups', muscle: 'Chest', difficulty: 'Advanced', icon: <Flame className="w-6 h-6" />, 
    desc: 'Explosive push-up variation that builds upper-body power and strength.',
    instructions: ['Start in a solid push-up position', 'Lower body under strict control', 'Push back up explosively so hands leave the floor', 'Clap hands together quickly', 'Land softly with slightly bent elbows']
  },
  { 
    name: 'Archer Push-ups', muscle: 'Chest', difficulty: 'Advanced', icon: <Target className="w-6 h-6" />, 
    desc: 'Unilateral pushing exercise focusing on one arm at a time for intense chest activation.',
    instructions: ['Assume an ultra-wide push-up stance', 'Lower body entirely toward one hand', 'Keep the opposite arm completely straight and extended', 'Push back up powerfully and alternate to the other side']
  },
  { 
    name: 'Decline Push-ups', muscle: 'Chest', difficulty: 'Advanced', icon: <ArrowDown className="w-6 h-6" />, 
    desc: 'Feet elevated push-ups targeting the upper chest and front deltoids.',
    instructions: ['Place feet securely on an elevated surface (bench or box)', 'Keep core tight and body perfectly straight', 'Lower chest smoothly to the floor', 'Press back up powerfully to full extension']
  },
  // Advanced Back
  { 
    name: 'Weighted Pull-ups', muscle: 'Back', difficulty: 'Advanced', icon: <ArrowUp className="w-6 h-6" />, 
    desc: 'Traditional pull-ups with added weight to drastically increase back strength.',
    instructions: ['Attach weight belt securely around waist', 'Grip bar firmly slightly wider than shoulder-width', 'Pull body upward until chin is completely over the bar', 'Lower slowly under full control for the entire descent']
  },
  { 
    name: 'Muscle-ups', muscle: 'Back', difficulty: 'Advanced', icon: <Flame className="w-6 h-6" />, 
    desc: 'Explosive upper body pull that transitions smoothly into a dip over the bar.',
    instructions: ['Grip bar securely using a false grip', 'Perform an explosive, powerful pull-up', 'Swiftly transition chest and shoulders over the bar', 'Press up into a straight bar dip at the top']
  },
  { 
    name: 'Archer Pull-ups', muscle: 'Back', difficulty: 'Advanced', icon: <Target className="w-6 h-6" />, 
    desc: 'Advanced unilateral pull-up shifting bodyweight almost entirely to one arm.',
    instructions: ['Grip bar firmly with a very wide grip', 'Pull bodyweight aggressively entirely toward one single hand', 'Extend the opposite arm perfectly straight over the bar', 'Lower under control and alternate sides']
  },
  // Advanced Legs
  { 
    name: 'Pistol Squats', muscle: 'Legs', difficulty: 'Advanced', icon: <Activity className="w-6 h-6" />, 
    desc: 'Intense single-leg squat requiring extreme balance, mobility, and leg strength.',
    instructions: ['Stand on one leg with the other fully extended forward', 'Squat all the way down until hamstring firmly touches calf', 'Keep chest upright and balance steady using arms', 'Drive powerfully back up to a standing position']
  },
  { 
    name: 'Jump Squats', muscle: 'Legs', difficulty: 'Advanced', icon: <Zap className="w-6 h-6" />, 
    desc: 'Explosive plyometric bodyweight squats to build elite lower body power.',
    instructions: ['Lower immediately into a standard deep squat', 'Explode upward intensely into a maximum height jump', 'Land softly on balls of feet to absorb impact safely', 'Immediately transition seamlessly into the very next rep']
  },
  { 
    name: 'Bulgarian Split Squats', muscle: 'Legs', difficulty: 'Advanced', icon: <Target className="w-6 h-6" />, 
    desc: 'Unilateral leg exercise with rear foot elevated to heavily load the lead leg.',
    instructions: ['Rest one foot elevated on a bench behind you', 'Keep chest remarkably high and core thoroughly engaged', 'Lower hips straight down until front thigh is parallel to floor', 'Drive powerfully through the front heel to rise']
  },
  // Advanced Core
  { 
    name: 'Hanging Leg Raises', muscle: 'Core', difficulty: 'Advanced', icon: <ArrowUp className="w-6 h-6" />, 
    desc: 'Advanced abdominal exercise involving hanging from a bar and lifting straight legs.',
    instructions: ['Hang freely from a pull-up bar with an overhand grip', 'Keep legs perfectly straight and locked together', 'Contract core to raise feet until they touch the pull-up bar', 'Lower legs incredibly slowly with absolute control']
  },
  { 
    name: 'Dragon Flag', muscle: 'Core', difficulty: 'Advanced', icon: <Flame className="w-6 h-6" />, 
    desc: 'Extreme core stability exercise elevating the entire lower body from a bench.',
    instructions: ['Lie on a flat bench and grip it firmly directly behind your head', 'Raise your entire body (except upper back) straight into the air', 'Lower body downward as a rigid, straight plank', 'Do not let hips sag whatsoever during the movement']
  },
  { 
    name: 'Plank with Arm Lift', muscle: 'Core', difficulty: 'Advanced', icon: <Activity className="w-6 h-6" />, 
    desc: 'Anti-rotational core movement performed by holding a plank and raising one arm.',
    instructions: ['Assume a rigid and flawless forearm plank position', 'Slowly extend one arm reaching straight forward', 'Keep hips completely stable and perfectly square to the floor', 'Hold extended briefly, return smoothly, and alternate arms']
  },
  // Advanced Shoulders
  { 
    name: 'Pike Push-ups', muscle: 'Shoulders', difficulty: 'Advanced', icon: <Dumbbell className="w-6 h-6" />, 
    desc: 'Bodyweight shoulder press simulation performing push-ups from an inverted V position.',
    instructions: ['Assume an inverted V position (downward relative dog pose)', 'Keep legs completely straight and back perfectly flat', 'Lower top of head toward the floor directly between hands', 'Press back aggressively straight up to starting position']
  },
  { 
    name: 'Handstand Push-ups', muscle: 'Shoulders', difficulty: 'Advanced', icon: <Flame className="w-6 h-6" />, 
    desc: 'Extreme bodyweight shoulder exercise pushing the entire bodyweight upside down.',
    instructions: ['Kick up aggressively into a handstand resting lightly against a wall', 'Lower body under strict control until head gently touches floor', 'Press powerfully downward until arms lockout completely', 'Maintain tight core tension to prevent extreme back arching']
  },
  { 
    name: 'Dumbbell Arnold Press', muscle: 'Shoulders', difficulty: 'Advanced', icon: <Zap className="w-6 h-6" />, 
    desc: 'Rotational shoulder press emphasizing all three heads of the deltoids.',
    instructions: ['Hold dumbbells directly in front of shoulders with palms facing you', 'Press weight fully overhead while rotating palms exactly to face forward', 'Lower under precise control while simultaneously rotating back to start', 'Maintain a rigid upright posture']
  },
  // Advanced Arms
  { 
    name: 'Close Grip Push-ups', muscle: 'Arms', difficulty: 'Advanced', icon: <Activity className="w-6 h-6" />, 
    desc: 'Push-up variation with hands close together to heavily load the triceps.',
    instructions: ['Place hands directly under the absolute center of your chest', 'Keep elbows tucked extremely tight against your ribs', 'Lower chest under control until it gently touches your hands', 'Press up actively engaging entirely through the triceps']
  },
  { 
    name: 'Diamond Push-ups', muscle: 'Arms', difficulty: 'Advanced', icon: <Target className="w-6 h-6" />, 
    desc: 'Triceps focused push-ups with hands forming a diamond shape below the chest.',
    instructions: ['Form a perfect diamond shape with your hands directly on the floor', 'Lower chest straight down directly over the diamond', 'Keep entire body locked unconditionally tight like a plank', 'Push up powerfully relying predominantly on triceps']
  },
  { 
    name: 'Weighted Dips', muscle: 'Arms', difficulty: 'Advanced', icon: <ArrowDown className="w-6 h-6" />, 
    desc: 'Parallel bar dips performed with a weight belt for advanced triceps and chest gains.',
    instructions: ['Strap heavy weight securely using an athletic dip belt', 'Support entire body perfectly on parallel bars', 'Lower strictly and smoothly until elbows physically hit 90 degrees', 'Drive backward forcefully up to full mechanical lockout']
  },
  // Advanced Full Body
  { 
    name: 'Advanced Burpees', muscle: 'Full Body', difficulty: 'Advanced', icon: <Flame className="w-6 h-6" />, 
    desc: 'High-speed explosive full body cardio endurance movement including a tuck jump.',
    instructions: ['Drop instantly into squat to kick intensely back to a plank', 'Perform a highly strict and deep push-up', 'Jump feet forcefully and quickly back directly to your hands', 'Explode upward vertically into an incredibly high knees tuck jump']
  },
  { 
    name: 'Advanced Mountain Climbers', muscle: 'Full Body', difficulty: 'Advanced', icon: <Activity className="w-6 h-6" />, 
    desc: 'High-intensity cross-body knee drives from a plank position for elite conditioning.',
    instructions: ['Assume a completely strict and rigid push-up plank posture', 'Drive knees extremely aggressively across your body toward opposite elbows', 'Minimize any vertical bouncing in the hips entirely', 'Maintain a severe, exhausting sprint-like pace without breaking']
  },
  { 
    name: 'Thrusters', muscle: 'Full Body', difficulty: 'Advanced', icon: <Zap className="w-6 h-6" />, 
    desc: 'Compound movement combining a front squat with an explosive push press.',
    instructions: ['Hold barbell or deep dumbbells in a solid front rack position', 'Perform a full depth front squat while remaining entirely upright', 'Explode up forcefully and press weight strictly overhead in one fluid motion', 'Lower back completely into the next squat seamlessly without pausing']
  }
];

const muscles = ['All', 'Chest', 'Back', 'Legs', 'Core', 'Shoulders', 'Arms', 'Full Body'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

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
                  {ex.icon}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-6 flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl text-white shadow-inner">
                  {selectedExercise.icon}
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
              <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
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
