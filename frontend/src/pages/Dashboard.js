// src/pages/Dashboard.js - Main dashboard showing today's summary

import React, { useEffect, useState, useRef } from 'react';
import { getProfile, getWorkoutPlan, getDietPlan, getTodayProgress, askAI } from '../services/api';
import WaterTracker from '../components/WaterTracker';
import { Target, Activity, Flame, Scale, Trophy, ChevronRight, Apple, MessageCircle, X, Send } from 'lucide-react';

const StatCard = ({ icon, label, value, colorClass }) => (
  <div className={`card relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-10 blur-2xl group-hover:scale-150 transition-transform duration-500 ${colorClass.bg}`} />
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl ${colorClass.iconBg} ${colorClass.iconText} shadow-inner`}>
        {icon}
      </div>
      <div>
        <p className="text-slate-400 text-sm font-medium mb-1">{label}</p>
        <p className="text-white font-bold text-2xl tracking-tight">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [profile,  setProfile]  = useState(null);
  const [workout,  setWorkout]  = useState(null);
  const [diet,     setDiet]     = useState(null);
  const [todayLog, setTodayLog] = useState(null);
  const [loading,  setLoading]  = useState(true);

  // Chat Widget State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  
  // Persist chat state across page refresh
  const [messages, setMessages] = useState(() => {
    const saved = sessionStorage.getItem('chatHistory');
    if (saved) return JSON.parse(saved);
    return [{ text: "Hey! 😊 I'm your fitness assistant. How can I help you today?", sender: 'bot' }];
  });
  const chatEndRef = useRef(null);

  useEffect(() => {
    sessionStorage.setItem('chatHistory', JSON.stringify(messages));
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = { text: chatInput, sender: 'user' };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      console.log("Frontend sending AI request:", { message: userMsg.text });
      // Send the entire previous history (excluding the current userMsg)
      const res = await askAI({ message: userMsg.text, history: messages });
      setMessages((prev) => [...prev, { text: res.data.reply, sender: 'bot' }]);
    } catch (error) {
      console.log("Chat API Error Caught:", error);
      const serverMsg = error.response && error.response.data && error.response.data.reply;
      setMessages((prev) => [...prev, { text: serverMsg || "Oops! I couldn't reach the server.", sender: 'bot' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, wRes, dRes, tRes] = await Promise.all([
          getProfile(),
          getWorkoutPlan(),
          getDietPlan(),
          getTodayProgress(),
        ]);
        setProfile(pRes.data);
        setWorkout(wRes.data);
        setDiet(dRes.data);
        setTodayLog(tRes.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-orange-400 text-xl animate-pulse">Loading Dashboard...</div>
      </div>
    );
  }

  // Determine today's workout based on day of week
  const days   = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today  = days[new Date().getDay()];
  const todayWorkout = workout?.weekPlan?.find((d) => d.day === today);

  const goalLabel = {
    weight_loss:  'Weight Loss',
    muscle_gain:  'Muscle Gain',
    maintenance:  'Maintenance',
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 mb-1">
            Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'},{' '}
            {profile?.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-400 text-sm font-medium">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {/* Streak badge */}
        <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500/10 to-rose-500/10 border border-orange-500/20 shadow-inner">
          <div className="bg-gradient-to-br from-orange-500 to-rose-500 p-2 rounded-xl shadow-lg shadow-orange-500/20">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-xl leading-none">{profile?.streak || 0}</p>
            <p className="text-orange-400 text-xs font-semibold uppercase tracking-wider mt-1">Day Streak</p>
          </div>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard 
          icon={<Target className="w-6 h-6" />} 
          label="Fitness Goal"     
          value={goalLabel[profile?.fitnessGoal] || '—'} 
          colorClass={{ bg: 'bg-orange-500', iconBg: 'bg-orange-500/20', iconText: 'text-orange-500' }} 
        />
        <StatCard 
          icon={<Scale className="w-6 h-6" />} 
          label="Current Weight"  
          value={profile?.weight ? `${profile.weight} kg` : '—'} 
          colorClass={{ bg: 'bg-blue-500', iconBg: 'bg-blue-500/20', iconText: 'text-blue-500' }} 
        />
        <StatCard 
          icon={<Activity className="w-6 h-6" />} 
          label="Calorie Goal"     
          value={`${profile?.caloriesGoal || 2000} kcal`} 
          colorClass={{ bg: 'bg-rose-500', iconBg: 'bg-rose-500/20', iconText: 'text-rose-500' }} 
        />
        <StatCard 
          icon={<Trophy className="w-6 h-6" />} 
          label="BMI Score"               
          value={
            profile?.height && profile?.weight
              ? (profile.weight / ((profile.height / 100) ** 2)).toFixed(1)
              : '—'
          } 
          colorClass={{ bg: 'bg-emerald-500', iconBg: 'bg-emerald-500/20', iconText: 'text-emerald-500' }} 
        />
      </div>

      {/* Main content: Today's workout + Diet + Water */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's workout */}
        <div className="lg:col-span-2 card bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-white font-bold text-xl flex items-center gap-2">
              <span className="bg-orange-500/20 text-orange-400 p-2 rounded-lg"><Activity className="w-5 h-5" /></span>
              Today's Workout
            </h2>
            <span className="text-slate-400 text-sm font-medium">{today}</span>
          </div>
          
          {todayWorkout ? (
            <>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <span className="badge bg-orange-500/10 text-orange-400 border border-orange-500/20 shadow-inner">
                  Focus: {todayWorkout.focus}
                </span>
                {todayWorkout.completed && (
                  <span className="badge bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-inner flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Completed
                  </span>
                )}
              </div>
              {todayWorkout.exercises.length > 0 ? (
                <div className="space-y-3">
                  {todayWorkout.exercises.slice(0, 4).map((ex, i) => (
                    <div key={i} className="group flex items-center justify-between bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl px-5 py-3 transition-colors cursor-default">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-400 group-hover:text-orange-400 group-hover:bg-orange-500/10 transition-colors">
                          {i + 1}
                        </div>
                        <span className="text-slate-200 font-medium">{ex.name}</span>
                      </div>
                      <span className="text-slate-400 text-sm bg-slate-900/50 px-3 py-1 rounded-lg border border-slate-800">{ex.sets} sets × {ex.reps}</span>
                    </div>
                  ))}
                  {todayWorkout.exercises.length > 4 && (
                    <div className="text-center pt-2">
                      <p className="text-slate-500 text-sm flex items-center justify-center gap-1">
                        + {todayWorkout.exercises.length - 4} more exercises <ChevronRight className="w-4 h-4" />
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                  <span className="text-4xl mb-3 block">🛌</span>
                  <p className="text-slate-400 font-medium">Rest Day</p>
                  <p className="text-slate-500 text-sm mt-1">Take time to recover!</p>
                </div>
              )}
            </>
          ) : (
             <div className="text-center py-10 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
               <p className="text-slate-400">No workout data available.</p>
             </div>
          )}
        </div>

        {/* Water tracker */}
        <div>
          <WaterTracker
            current={todayLog?.waterIntake || 0}
            goal={profile?.waterGoal || 8}
          />
        </div>
      </div>

      {/* Today's diet summary */}
      {diet && (
        <div className="card bg-gradient-to-br from-slate-800/80 to-slate-900/80">
          <div className="flex items-center gap-2 mb-6">
             <span className="bg-green-500/20 text-green-400 p-2 rounded-lg"><Apple className="w-5 h-5" /></span>
             <h2 className="text-white font-bold text-xl">Today's Diet Summary</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['breakfast', 'lunch', 'dinner', 'snacks'].map((meal) => (
              <div key={meal} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 text-center hover:bg-slate-700/30 transition-colors">
                <p className="text-slate-400 capitalize font-medium text-sm mb-2">{meal}</p>
                <p className="text-orange-400 font-bold text-xl mb-1">{diet[meal]?.calories} <span className="text-xs text-orange-400/70 font-normal">kcal</span></p>
                <p className="text-slate-300 text-xs line-clamp-1">{diet[meal]?.name?.split(' ').slice(0, 3).join(' ')}...</p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-6 border-t border-slate-700/50 flex flex-wrap gap-8 justify-center bg-slate-900/30 rounded-xl p-4">
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Total Calories</p>
              <p className="text-orange-400 font-bold text-2xl">{diet.totalCalories}</p>
            </div>
            <div className="w-px h-10 bg-slate-700 hidden sm:block"></div>
            <div className="text-center">
              <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Protein</p>
              <p className="text-blue-400 font-bold text-2xl">{diet.totalProtein}<span className="text-sm ml-0.5">g</span></p>
            </div>
            <div className="w-px h-10 bg-slate-700 hidden sm:block"></div>
            <div className="text-center">
               <p className="text-slate-400 text-xs mb-1 uppercase tracking-wider font-semibold">Carbs</p>
              <p className="text-emerald-400 font-bold text-2xl">{diet.totalCarbs}<span className="text-sm ml-0.5">g</span></p>
            </div>
          </div>
        </div>
      )}

      {/* AI Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        {isChatOpen ? (
          <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-80 sm:w-96 h-[400px] mb-4 flex flex-col overflow-hidden animate-fade-in-up">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-500 to-rose-500 p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-xl leading-none">💬</span>
                </div>
                <div className="flex flex-col">
                  <h3 className="text-white font-bold leading-tight">FitBuddy AI</h3>
                  <span className="text-white/70 text-xs font-medium">Your Fitness Assistant</span>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
                title="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-900/50">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2 text-sm shadow-sm ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                      : 'bg-slate-700 text-slate-200 border border-slate-600 rounded-2xl rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-700 border border-slate-600 text-slate-400 rounded-2xl rounded-bl-sm px-4 py-3 text-sm flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="p-3 bg-slate-800 border-t border-slate-700">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask about workout, diet..."
                  className="flex-1 bg-slate-900 text-white placeholder-slate-400 text-sm rounded-xl px-4 py-2 border border-slate-700 focus:outline-none focus:border-orange-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white p-2 rounded-xl transition-colors flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-rose-500 hover:scale-110 transition-transform duration-300 text-white w-14 h-14 rounded-full shadow-lg shadow-orange-500/40 flex items-center justify-center animate-fade-in-up"
            title="Open AI Assistant"
          >
            <span className="text-2xl leading-none">💬</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
