const fs = require('fs');

const data = {
  Chest: {
    Beginner: ['Knee Push-ups', 'Wall Push-ups', 'Incline Dumbbell Press', 'Pec Deck Machine', 'Seated Chest Press'],
    Intermediate: ['Standard Push-ups', 'Barbell Bench Press', 'Dumbbell Flyes', 'Cable Crossovers', 'Decline Bench Press'],
    Advanced: ['Clap Push-ups', 'Archer Push-ups', 'Weighted Dips', 'Guillotine Press', 'One-Arm Push-ups']
  },
  Back: {
    Beginner: ['Resistance Band Rows', 'Superman Hold', 'Machine Pulldowns', 'Dumbbell Rows', 'Inverted Rows (knees bent)'],
    Intermediate: ['Pull-ups', 'Barbell Rows', 'T-Bar Rows', 'Seated Cable Rows', 'Lat Pulldowns'],
    Advanced: ['Muscle-ups', 'Weighted Pull-ups', 'Front Lever', 'One-Arm Pull-ups', 'Pendlay Rows']
  },
  Legs: {
    Beginner: ['Bodyweight Squats', 'Walking Lunges', 'Glute Bridges', 'Step-ups', 'Calf Raises'],
    Intermediate: ['Barbell Squats', 'Romanian Deadlifts', 'Leg Press', 'Bulgarian Split Squats', 'Goblet Squats'],
    Advanced: ['Pistol Squats', 'Jump Squats', 'Sissy Squats', 'Heavy Deadlifts', 'Overhead Squats']
  },
  Core: {
    Beginner: ['Standard Plank', 'Crunches', 'Bicycle Crunches', 'Leg Raises', 'Russian Twists'],
    Intermediate: ['Hanging Knee Raises', 'V-Ups', 'Ab Wheel Rollouts', 'Cable Woodchoppers', 'Decline Crunches'],
    Advanced: ['Dragon Flag', 'Human Flag', 'L-Sit', 'Weighted Hanging Leg Raises', 'Windshield Wipers']
  },
  Shoulders: {
    Beginner: ['Seated Dumbbell Press', 'Lateral Raises', 'Front Raises', 'Machine Shoulder Press', 'Resistance Band Pull-aparts'],
    Intermediate: ['Overhead Barbell Press', 'Arnold Press', 'Upright Rows', 'Face Pulls', 'Reverse Pec Deck'],
    Advanced: ['Handstand Push-ups', 'Pike Push-ups', 'Z-Press', 'Heavy Push Press', 'Iron Cross']
  },
  Arms: {
    Beginner: ['Dumbbell Curls', 'Triceps Pushdowns', 'Hammer Curls', 'Bench Dips', 'Concentration Curls'],
    Intermediate: ['Barbell Curls', 'Overhead Tricep Extension', 'Preacher Curls', 'Skull Crushers', 'EZ Bar Curls'],
    Advanced: ['Strict Curl', 'Weighted Dips (Triceps)', 'Spider Curls', 'Close Grip Bench Press', 'One-Arm Tricep Extension']
  },
  'Full Body': {
    Beginner: ['Jumping Jacks', 'Burpees (no pushup)', 'Mountain Climbers', 'Kettlebell Deadlift', 'Bear Crawls'],
    Intermediate: ['Standard Burpees', 'Kettlebell Swings', 'Box Jumps', 'Thrusters', 'Medicine Ball Slams'],
    Advanced: ['Advanced Burpees', 'Snatch', 'Clean and Jerk', 'Devil Press', 'Muscle-up to Barbell']
  }
};

const exercises = [];
for (const [muscle, difficulties] of Object.entries(data)) {
  for (const [difficulty, names] of Object.entries(difficulties)) {
    names.forEach(name => {
      const imageName = name.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '') + '.jpg';
      exercises.push({
        name,
        muscle,
        difficulty,
        image: imageName,
        desc: `This is an impressive ${difficulty.toLowerCase()} level ${muscle.toLowerCase()} exercise aiming to dramatically improve your physical fitness. Focus intensely on proper form and maintain strictly controlled breathing patterns.`,
        instructions: [
          'Warm up deeply before beginning this grueling movement.',
          'Focus intensely on your breathing and fully activate the target muscle.',
          'Maintain a rigorous, remarkably controlled pace throughout the entire motion.',
          'Execute all prescribed repetitions focusing strictly on tension and form.',
          'Rest properly between sets to recover your energy.'
        ]
      });
    });
  }
}

// 1. Write the new dataset file
const dataFile = 'const exercises = ' + JSON.stringify(exercises, null, 2) + ';\nexport default exercises;';
fs.mkdirSync('c:/Custom_Diet_and_Workout_Planner/frontend/src/data', { recursive: true });
fs.writeFileSync('c:/Custom_Diet_and_Workout_Planner/frontend/src/data/exercisesData.js', dataFile);

// 2. Modifying ExerciseLibrary.js to dynamically use the dataset
const path = 'c:/Custom_Diet_and_Workout_Planner/frontend/src/pages/ExerciseLibrary.js';
let content = fs.readFileSync(path, 'utf8');

// Replace the massive hardcoded exercises array with import
content = content.replace(/const exercises = \[[\s\S]*?\];\s*(const muscles =)/, "import exercises from '../data/exercisesData';\n\n$1");

// We need to inject an Icons dictionary after component definition starts, or globally
const iconsInject = `
const categoryIcons = {
  Chest: <Dumbbell className="w-6 h-6" />,
  Back: <ArrowUp className="w-6 h-6" />,
  Legs: <Zap className="w-6 h-6" />,
  Core: <Activity className="w-6 h-6" />,
  Shoulders: <ArrowRight className="w-6 h-6" />,
  Arms: <ArrowDown className="w-6 h-6" />,
  'Full Body': <Flame className="w-6 h-6" />
};

const difficultyColors =`;
content = content.replace(/const difficultyColors =/, iconsInject);

// Then replace the individual usage of ex.icon
content = content.replace(/\{ex\.icon\}/g, '{categoryIcons[ex.muscle] || <Target className="w-6 h-6" />}');
content = content.replace(/\{selectedExercise\.icon\}/g, '{categoryIcons[selectedExercise.muscle] || <Target className="w-6 h-6" />}');

fs.writeFileSync(path, content);
console.log('Successfully completed Exercise Data migration. 105+ Exercises linked!');
