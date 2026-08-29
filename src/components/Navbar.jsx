import React from 'react';
import { Briefcase, Plus, User, LogOut, Sparkles, ChevronDown, Download } from 'lucide-react';

export default function Navbar({ currentUser, onOpenAddModal, onOpenProfileModal, onExportExcel, onLogout }) {
  const userName = currentUser?.fullName || currentUser?.name || 'Candidate Profile';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 backdrop-blur-md bg-white/90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/30 transform hover:scale-105 transition-transform">
              <Briefcase className="w-5.5 h-5.5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black tracking-tight text-slate-900">
                  Career<span className="text-violet-600 font-extrabold">Plus</span>
                </h1>
                <span className="bg-violet-100 text-violet-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center">
                  <Sparkles className="w-3 h-3 mr-0.5" /> Tracker
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block">
                Job &amp; Internship Application Dashboard
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center space-x-3">
            
            {/* Export Progress Report Excel Button */}
            {onExportExcel && (
              <button
                type="button"
                onClick={onExportExcel}
                className="inline-flex items-center justify-center px-3 py-2 rounded-2xl text-xs font-extrabold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 shadow-2xs transition-all duration-200 cursor-pointer"
                title="Download Applications Progress Report (Excel / CSV)"
              >
                <Download className="w-4 h-4 mr-1 text-emerald-600" />
                <span className="hidden md:inline">Export Report</span>
              </button>
            )}

            {/* User Profile Pill */}
            <button
              type="button"
              onClick={onOpenProfileModal}
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-2xl transition-all cursor-pointer group"
              title="Manage Candidate Profile & Resumes"
            >
              <div className="w-7 h-7 rounded-full bg-violet-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {userInitial}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-xs font-bold text-slate-800 group-hover:text-violet-700 transition-colors line-clamp-1">
                  {userName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">My Resumes &amp; Profile</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-colors hidden sm:block" />
            </button>

            {/* Primary "+ Add Application" Action Button */}
            <button
              type="button"
              onClick={onOpenAddModal}
              className="inline-flex items-center justify-center px-4 py-2 rounded-2xl text-xs font-black text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-md shadow-violet-600/25 transition-all duration-200 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4 mr-1.5 stroke-[3]" />
              <span>Add Application</span>
            </button>

            {/* Logout Button */}
            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
              title="Logout Account"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>

          </div>

        </div>
      </div>
    </header>
  );
}
