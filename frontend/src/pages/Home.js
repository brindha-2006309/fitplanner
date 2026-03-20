// src/pages/Home.js - Public landing page

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Salad, LineChart, Activity, Droplets, Flame, ArrowRight, Zap } from 'lucide-react';

const features = [
  { icon: <Dumbbell className="w-8 h-8 text-orange-400" />, title: 'Workout Planner',    desc: 'Personalized weekly plans based on your fitness goal' },
  { icon: <Salad className="w-8 h-8 text-green-400" />, title: 'Diet Planner',       desc: 'Balanced meal plans with calorie & macro tracking' },
  { icon: <LineChart className="w-8 h-8 text-blue-400" />, title: 'Progress Tracker',   desc: 'Visualize your fitness journey with beautiful charts' },
  { icon: <Activity className="w-8 h-8 text-rose-400" />, title: 'BMI Calculator',    desc: 'Know your health status instantly' },
  { icon: <Droplets className="w-8 h-8 text-cyan-400" />, title: 'Water Tracker',      desc: 'Stay hydrated with daily water intake reminders' },
  { icon: <Flame className="w-8 h-8 text-orange-500" />, title: 'Streak Tracker',     desc: 'Build consistency with workout streak tracking' },
];

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white selection:bg-orange-500/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-40 text-center px-4">
        {/* Background gradient orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 text-orange-400 text-sm font-semibold mb-8 backdrop-blur-sm animate-fade-in-up">
            <Zap className="w-4 h-4" />
            <span>Your Personal Fitness Companion</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight tracking-tight">
            Transform Your Body with <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-500 to-rose-500">
              Custom Plans
            </span>
          </h1>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            Achieve your dream physique with AI-driven workout routines, balanced macro-friendly diets, 
            and advanced progress analytics — all tailored specifically to you.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto">
            {isLoggedIn ? (
              <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group">
                Go to Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <>
                <button onClick={() => navigate('/register')} className="w-full sm:w-auto btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group">
                  Start Your Journey
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/login')} className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 font-semibold py-4 px-8 rounded-xl transition-all duration-200">
                  Sign In
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Everything You Need to Succeed</h2>
          <p className="text-slate-400 text-lg">Powerful tools built for your transformation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="card group hover:border-orange-500/30 hover:shadow-orange-900/20 hover:bg-slate-800/80
                         transition-all duration-300 hover:-translate-y-2 cursor-default"
            >
              <div className="bg-slate-900/50 p-4 rounded-xl inline-block mb-4 border border-slate-700/50 group-hover:scale-110 transition-transform shadow-inner">
                {f.icon}
              </div>
              <h3 className="text-white font-bold text-xl mb-2">{f.title}</h3>
              <p className="text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-t border-slate-800/50 py-24 text-center px-4 bg-gradient-to-b from-slate-900 to-[#0a0f1c]">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-6 tracking-tight">Ready to Transform?</h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Join thousands of users who have already started their journey to a healthier, stronger self.
          </p>
          <button onClick={() => navigate('/register')} className="btn-primary text-lg px-10 py-4 flex items-center justify-center gap-2 mx-auto group">
            <Flame className="w-5 h-5 text-yellow-300 group-hover:animate-pulse" />
            Start Your Journey 
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
