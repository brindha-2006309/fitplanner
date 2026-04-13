// src/pages/ResetPassword.js

import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { resetPasswordRequest } from '../services/api';
import { Lock, CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
       setError('Password must be at least 6 characters');
       return;
    }

    setLoading(true);
    try {
      const { data } = await resetPasswordRequest(token, { password });
      setMessage(data.message || 'Password reset successfully');
      setTimeout(() => {
         navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error occurred or token expired. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-orange-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-rose-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Back to Login</span>
        </Link>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg shadow-orange-500/20 mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Set New Password</h1>
          <p className="text-slate-400 mt-2">Create a new secure password</p>
        </div>

        <div className="card backdrop-blur-2xl bg-slate-800/60 border-slate-700/50 shadow-2xl p-6 rounded-2xl">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="shrink-0">⚠️</span> {error}
            </div>
          )}
          {message && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2">
              <span className="shrink-0">✅</span> {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-slate-300 text-sm font-semibold block mb-2">New Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters"
                  required
                  className="input-field pl-11 w-full bg-slate-900 border border-slate-700 rounded-xl py-3 text-slate-200 outline-none focus:border-orange-500"
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  required
                  className="input-field pl-11 w-full bg-slate-900 border border-slate-700 rounded-xl py-3 text-slate-200 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!message}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl py-3.5 mt-4 disabled:opacity-70 flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? 'Saving...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
