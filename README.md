# 🏋️ Custom Workout & Diet Planner

> A full-stack MERN web application for personalized fitness tracking — built for the college project expo.

---

## 📋 Project Description

**FitPlanner** is a comprehensive fitness web app that generates personalized workout and diet plans based on each user's fitness goal (Weight Loss, Muscle Gain, or Maintenance). It includes progress tracking, BMI calculation, water intake monitoring, and a streak tracker.

### Key Features
- 🔐 JWT-based user authentication (register/login)
- 👤 User profile with age, gender, height, weight, and fitness goal
- 💪 Weekly workout planner with exercises (sets, reps, rest time)
- 🥗 Daily diet planner with calories, protein, and carbs
- 📈 Progress tracker with charts (weight, calories burned)
- ⚖️ BMI calculator with health category
- 💧 Water intake tracker with progress bar
- 🏃 Exercise library with 18+ exercises (filter by muscle group)
- 🔥 Fitness streak tracker (consecutive workout days)

---

## 📁 Folder Structure

```
custom-workout-diet-planner/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Workout.js
│   │   ├── Diet.js
│   │   └── Progress.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── workoutController.js
│   │   ├── dietController.js
│   │   ├── progressController.js
│   │   └── profileController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── workoutRoutes.js
│   │   ├── dietRoutes.js
│   │   ├── progressRoutes.js
│   │   └── profileRoutes.js
│   └── middleware/
│       └── authMiddleware.js
│
├── frontend/
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── public/
│   │   └── index.html
│   └── src/
│       ├── App.js
│       ├── index.js
│       ├── index.css
│       ├── services/
│       │   └── api.js
│       ├── components/
│       │   ├── Navbar.js
│       │   ├── Sidebar.js
│       │   ├── WorkoutCard.js
│       │   ├── DietCard.js
│       │   ├── ProgressChart.js
│       │   └── WaterTracker.js
│       └── pages/
│           ├── Home.js
│           ├── Login.js
│           ├── Register.js
│           ├── Dashboard.js
│           ├── WorkoutPlanner.js
│           ├── DietPlanner.js
│           ├── ProgressTracker.js
│           ├── BMICalculator.js
│           ├── ExerciseLibrary.js
│           └── Profile.js
│
└── README.md
```

---

## 🛠️ Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| Frontend  | React 18, Tailwind CSS, Axios, React Router v6, Recharts |
| Backend   | Node.js, Express.js         |
| Database  | MongoDB, Mongoose           |
| Auth      | JWT (JSON Web Tokens), bcryptjs |

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v16+ installed
- MongoDB running locally **OR** a MongoDB Atlas connection string
- npm or yarn

---

### 1️⃣ Clone / Extract the Project
```
Extract the ZIP file into a folder named: custom-workout-diet-planner
```

---

### 2️⃣ Setup the Backend

```bash
cd backend
npm install
```

**Configure environment variables:**

Copy `.env.example` to `.env` (already done for you) and update the values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/workout_diet_planner
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
```

> 💡 For **MongoDB Atlas** (cloud), replace `MONGO_URI` with your Atlas connection string:
> `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/workout_diet_planner`

---

### 3️⃣ Run the Backend

```bash
cd backend
npm start
```

The server starts at: **http://localhost:5000**

You should see:
```
✅ MongoDB Connected: localhost
✅ Server running on http://localhost:5000
```

---

### 4️⃣ Setup the Frontend

```bash
cd frontend
npm install
```

---

### 5️⃣ Run the Frontend

```bash
cd frontend
npm start
```

The app opens at: **http://localhost:3000**

---

## 🔗 API Endpoints

| Method | Endpoint                        | Description              | Auth? |
|--------|---------------------------------|--------------------------|-------|
| POST   | /api/auth/register              | Register new user        | No    |
| POST   | /api/auth/login                 | Login user               | No    |
| GET    | /api/auth/me                    | Get current user         | Yes   |
| GET    | /api/profile                    | Get user profile         | Yes   |
| PUT    | /api/profile                    | Update user profile      | Yes   |
| GET    | /api/workout                    | Get workout plan         | Yes   |
| POST   | /api/workout/generate           | Regenerate workout plan  | Yes   |
| PUT    | /api/workout/complete/:dayIndex | Mark day as done         | Yes   |
| GET    | /api/diet                       | Get diet plan            | Yes   |
| POST   | /api/diet/generate              | Regenerate diet plan     | Yes   |
| GET    | /api/progress                   | Get 30-day history       | Yes   |
| POST   | /api/progress                   | Log today's progress     | Yes   |
| GET    | /api/progress/today             | Get today's entry        | Yes   |
| PUT    | /api/progress/water             | Update water intake      | Yes   |

---

## 🗄️ MongoDB Schemas

### User
| Field       | Type    | Description                          |
|-------------|---------|--------------------------------------|
| name        | String  | Full name                            |
| email       | String  | Unique email                         |
| password    | String  | bcrypt hashed password               |
| age / gender / height / weight | Various | Profile data |
| fitnessGoal | String  | weight_loss / muscle_gain / maintenance |
| streak      | Number  | Consecutive workout days             |

### Workout
Stores the 7-day plan with exercises (name, sets, reps, rest time, completion status).

### Diet
Stores breakfast, lunch, dinner, snacks with calories, protein, carbs per meal.

### Progress
Daily entries: weight, caloriesBurned, waterIntake, workoutDone, notes.

---

## 🚀 Running Both Servers

Open **two terminal windows:**

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

---

## 👥 Developer Notes

- After registering, go to **Profile** page to set your fitness goal — this determines your workout and diet plans.
- Click **"Regenerate Plan"** on Workout or Diet pages whenever you change your fitness goal.
- The progress chart requires at least 2 logged entries to display.
- Water tracker syncs automatically with the backend.

---

*Built with ❤️ for the College Project Expo*
