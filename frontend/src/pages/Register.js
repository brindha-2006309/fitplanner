// src/pages/Register.js - User registration page

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Trophy, User, Mail, Lock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await registerUser({
        name:     form.name,
        email:    form.email,
        password: form.password,
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      // Redirect to profile to complete setup
      navigate('/profile');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 py-10 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Back button */}
        <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
          <p className="text-slate-400 mt-2">Start your transformation today</p>
        </div>

        {/* Form card */}
        <div className="card backdrop-blur-2xl bg-slate-800/60 border-slate-700/50 shadow-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>
            
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@email.com"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>
            
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Min. 6 characters"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>
            
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CheckCircle className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="input-field pl-11"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 mt-4 disabled:opacity-70 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                'Creating Account...'
              ) : (
                <>
                  Create Account <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-slate-400 text-sm text-center mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
