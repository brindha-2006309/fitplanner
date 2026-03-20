// src/components/Navbar.js - Top navigation bar

import React from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Dumbbell, Menu, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const navigate  = useNavigate();
  const user      = JSON.parse(localStorage.getItem('user') || '{}');
  const userName  = user.name || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0 z-50">
      {/* App title */}
      <Link to="/" className="flex items-center gap-2 group">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-xl shadow-lg shadow-orange-500/20 group-hover:scale-110 transition-transform">
          <Dumbbell className="text-white w-6 h-6" />
        </div>
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-extrabold text-xl hidden md:block tracking-tight">
          FitPlanner
        </span>
      </Link>

      {/* Right side: greeting + logout */}
      <div className="flex items-center gap-6">
        <Link to="/profile" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/50 rounded-full border border-slate-700/50">
          <User className="w-4 h-4 text-orange-400" />
          <span className="text-slate-300 text-sm font-medium">
            <span className="text-white">{userName}</span>
          </span>
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 hover:border-red-500/40 text-sm font-semibold px-4 py-2 rounded-xl transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
