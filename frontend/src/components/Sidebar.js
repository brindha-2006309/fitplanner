// src/components/Sidebar.js - Left navigation sidebar

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Dumbbell, Salad, TrendingUp, Scale, Activity, User, ChevronLeft, ChevronRight } from 'lucide-react';

const navItems = [
  { path: '/dashboard',  label: 'Dashboard',        icon: <LayoutDashboard className="w-5 h-5" /> },
  { path: '/workout',    label: 'Workout Planner',  icon: <Dumbbell className="w-5 h-5" /> },
  { path: '/diet',       label: 'Diet Planner',     icon: <Salad className="w-5 h-5" /> },
  { path: '/progress',   label: 'Progress Tracker', icon: <TrendingUp className="w-5 h-5" /> },
  { path: '/bmi',        label: 'BMI Calculator',   icon: <Scale className="w-5 h-5" /> },
  { path: '/exercises',  label: 'Exercise Library', icon: <Activity className="w-5 h-5" /> },
  { path: '/profile',    label: 'Profile',          icon: <User className="w-5 h-5" /> },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-slate-900/95 border-r border-slate-800 flex flex-col transition-all duration-300 backdrop-blur-xl shrink-0 z-40 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle button */}
      <div className="p-4 flex justify-end h-16 items-center border-b border-slate-800/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-slate-400 hover:text-white hover:bg-slate-800 p-1.5 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto custom-scrollbar">
        {navItems.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg shadow-orange-500/20 font-semibold'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100 font-medium'
              } ${collapsed ? 'justify-center' : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110 group-hover:text-orange-400'}`}>
                  {icon}
                </span>
                {!collapsed && <span className="truncate">{label}</span>}
                
                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-4 px-3 py-1.5 bg-slate-800 text-white text-xs font-semibold rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 whitespace-nowrap shadow-xl border border-slate-700 pointer-events-none before:content-[''] before:absolute before:top-1/2 before:-translate-y-1/2 before:-left-1 before:border-4 before:border-transparent before:border-r-slate-800">
                    {label}
                  </div>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer branding */}
      <div className="p-4 border-t border-slate-800/50 flex flex-col items-center justify-center">
        {!collapsed ? (
          <div className="text-center w-full">
            <p className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-400 mb-1">
              Antigravity Planner
            </p>
            <p className="text-[10px] text-slate-500 font-medium">v2.0 UI Edition</p>
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-500 to-rose-500 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-orange-500/20">
            AG
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
