// controllers/dietController.js - Handles diet plan generation based on fitness goal

const Diet = require('../models/Diet');
const User = require('../models/User');

const mealOptions = {
  breakfast: [
    { name: 'Eggs + Toast + Milk', baseCalories: 450, baseProtein: 28, baseCarbs: 40, baseFat: 16, items: ['3 whole eggs', '2 slices whole wheat toast', '1 glass low-fat milk'] },
    { name: 'Oats + Banana', baseCalories: 380, baseProtein: 12, baseCarbs: 70, baseFat: 6, items: ['1.5 cups oatmeal', '1 sliced banana', '1 tbsp honey'] },
    { name: 'Idli + Sambar', baseCalories: 400, baseProtein: 14, baseCarbs: 75, baseFat: 5, items: ['3 steamed idlis', '1 bowl hot sambar', 'Coconut chutney'] },
    { name: 'Smoothie Bowl', baseCalories: 350, baseProtein: 10, baseCarbs: 60, baseFat: 8, items: ['Mixed berry smoothie', 'Granola topping', 'Chia seeds'] }
  ],
  lunch: [
    { name: 'Rice + Chicken Curry', baseCalories: 600, baseProtein: 45, baseCarbs: 60, baseFat: 18, items: ['1 cup brown rice', '200g chicken curry', 'Side salad'] },
    { name: 'Chapati + Dal', baseCalories: 500, baseProtein: 20, baseCarbs: 85, baseFat: 10, items: ['3 whole wheat chapatis', '1 huge bowl yellow dal', 'Cucumber slices'] },
    { name: 'Paneer + Roti', baseCalories: 550, baseProtein: 25, baseCarbs: 55, baseFat: 24, items: ['150g grilled paneer tikka', '2 rotis', 'Mint chutney'] },
    { name: 'Veg Rice', baseCalories: 520, baseProtein: 12, baseCarbs: 90, baseFat: 12, items: ['1.5 cups mixed vegetable fried rice', 'Raita', 'Roasted papad'] }
  ],
  dinner: [
    { name: 'Grilled Chicken + Vegetables', baseCalories: 480, baseProtein: 45, baseCarbs: 25, baseFat: 16, items: ['150g grilled chicken breast', 'Steamed broccoli and carrots', 'Olive oil dressing'] },
    { name: 'Salad + Boiled Eggs', baseCalories: 380, baseProtein: 24, baseCarbs: 15, baseFat: 20, items: ['Large bowl mixed greens', '3 boiled eggs', 'Cherry tomatoes'] },
    { name: 'Soup + Toast', baseCalories: 320, baseProtein: 10, baseCarbs: 50, baseFat: 8, items: ['1 large bowl tomato soup', '2 slices garlic toast', 'Side greens'] },
    { name: 'Light Khichdi', baseCalories: 420, baseProtein: 15, baseCarbs: 70, baseFat: 10, items: ['1 bowl hot moong dal khichdi', '1 tsp ghee', 'Pickle'] }
  ],
  snacks: [
    { name: 'Fruits', baseCalories: 150, baseProtein: 2, baseCarbs: 35, baseFat: 1, items: ['1 fresh apple', '1 medium orange', 'Handful of grapes'] },
    { name: 'Nuts', baseCalories: 280, baseProtein: 8, baseCarbs: 12, baseFat: 24, items: ['Handful of mixed almonds and walnuts', 'A few raisins'] },
    { name: 'Protein Shake', baseCalories: 130, baseProtein: 25, baseCarbs: 4, baseFat: 1, items: ['1 scoop whey protein', '300ml water or skim milk', 'Ice cubes'] },
    { name: 'Boiled Corn', baseCalories: 180, baseProtein: 6, baseCarbs: 35, baseFat: 2, items: ['1 cup hot boiled sweet corn', 'Pinch of salt and black pepper'] }
  ]
};

const getRandomPlan = (goal) => {
  const mult = goal === 'weight_loss' ? 0.8 : goal === 'muscle_gain' ? 1.4 : 1.0;
  
  const b = mealOptions.breakfast[Math.floor(Math.random() * mealOptions.breakfast.length)];
  const l = mealOptions.lunch[Math.floor(Math.random() * mealOptions.lunch.length)];
  const d = mealOptions.dinner[Math.floor(Math.random() * mealOptions.dinner.length)];
  const s = mealOptions.snacks[Math.floor(Math.random() * mealOptions.snacks.length)];
  
  const scale = (item) => ({
    name: item.name,
    calories: Math.round(item.baseCalories * mult),
    protein: Math.round(item.baseProtein * mult),
    carbohydrates: Math.round(item.baseCarbs * mult),
    fat: Math.round(item.baseFat * mult),
    items: item.items
  });

  return { breakfast: scale(b), lunch: scale(l), dinner: scale(d), snacks: scale(s) };
};

// @desc    Get or generate diet plan for user
// @route   GET /api/diet
// @access  Private
const getDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    let diet = await Diet.findOne({ user: req.user._id });

    if (!diet) {
      const plan = getRandomPlan(user.fitnessGoal);
      const totalCalories = plan.breakfast.calories + plan.lunch.calories + plan.dinner.calories + plan.snacks.calories;
      const totalProtein  = plan.breakfast.protein  + plan.lunch.protein  + plan.dinner.protein  + plan.snacks.protein;
      const totalCarbs    = plan.breakfast.carbohydrates + plan.lunch.carbohydrates + plan.dinner.carbohydrates + plan.snacks.carbohydrates;

      diet = await Diet.create({
        user:          req.user._id,
        fitnessGoal:   user.fitnessGoal,
        ...plan,
        totalCalories,
        totalProtein,
        totalCarbs,
      });
    }

    res.json(diet);
  } catch (error) {
    console.error('Get diet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Regenerate diet plan when fitness goal changes or refresh is clicked
// @route   POST /api/diet/generate
// @access  Private
const generateDietPlan = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const existingDiet = await Diet.findOne({ user: req.user._id });
    
    let plan;
    let attempts = 0;
    do {
      plan = getRandomPlan(user.fitnessGoal);
      attempts++;
    } while (
      existingDiet && 
      plan.breakfast.name === existingDiet.breakfast?.name && 
      plan.lunch.name === existingDiet.lunch?.name && 
      attempts < 5
    );

    const totalCalories = plan.breakfast.calories + plan.lunch.calories + plan.dinner.calories + plan.snacks.calories;
    const totalProtein  = plan.breakfast.protein  + plan.lunch.protein  + plan.dinner.protein  + plan.snacks.protein;
    const totalCarbs    = plan.breakfast.carbohydrates + plan.lunch.carbohydrates + plan.dinner.carbohydrates + plan.snacks.carbohydrates;

    await Diet.findOneAndDelete({ user: req.user._id });

    const diet = await Diet.create({
      user:          req.user._id,
      fitnessGoal:   user.fitnessGoal,
      ...plan,
      totalCalories,
      totalProtein,
      totalCarbs,
    });

    res.json(diet);
  } catch (error) {
    console.error('Generate diet error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Mark a specific meal as complete
// @route   PUT /api/diet/complete/:mealType
// @access  Private
const markMealComplete = async (req, res) => {
  try {
    const { mealType } = req.params;
    
    const validMeals = ['breakfast', 'lunch', 'dinner', 'snacks'];
    if (!validMeals.includes(mealType)) {
      return res.status(400).json({ message: 'Invalid meal type' });
    }

    const diet = await Diet.findOne({ user: req.user._id });
    if (!diet) {
      return res.status(404).json({ message: 'Diet plan not found' });
    }

    // Set meal as completed
    diet[mealType].completed = true;
    await diet.save();

    res.json(diet);
  } catch (error) {
    console.error('Mark meal complete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getDietPlan, generateDietPlan, markMealComplete };
