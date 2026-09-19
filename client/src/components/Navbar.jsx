import React from 'react';
import { Search, Bell, MessageSquare, ChevronDown } from 'lucide-react';

export default function Navbar({ user }) {
  return (
    <header className="sticky top-0 z-50 bg-[#030F26]/90 backdrop-blur-md border-b border-slate-800/80 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
            <MessageSquare className="w-5 h-5 fill-current" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white block leading-none">
              VICHAAR
            </span>
            <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
              Share Your Thoughts
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-xl hidden md:block">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search opinions, topics, discussions..."
              className="w-full bg-[#0B1528] text-slate-200 text-sm pl-11 pr-4 py-2.5 rounded-full border border-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Actions & Profile */}
        <div className="flex items-center gap-4">
          <button 
            aria-label="Notifications"
            className="relative p-2.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-[#030F26]" />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-white leading-tight">
                {user?.name || 'Abhishek'}
              </p>
              <p className="text-xs text-slate-400">@abhishek</p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
          </div>

        </div>

      </div>
    </header>
  );
}