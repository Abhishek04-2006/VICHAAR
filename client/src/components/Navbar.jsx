import React from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

export default function Navbar({ currentUser, searchQuery, setSearchQuery, onOpenLogin, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity matching sidebar width (~w-64) */}
        <div className="flex items-center gap-3 w-56 sm:w-64 shrink-0">
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-blue-500/20 border border-blue-500/30 shrink-0 bg-[#070e1c] flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="VICHAAR" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <span className="font-black text-white text-lg tracking-wider block leading-none truncate">
              VICHAAR
            </span>
            <span className="text-[9px] text-blue-400 font-semibold tracking-wider uppercase mt-1 block truncate">
              Share Your Thoughts
            </span>
          </div>
        </div>

        {/* Center: Search Bar aligned with feed */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opinions, topics, discussions..."
              className="w-full bg-[#0B1528] border border-slate-800/80 focus:border-blue-500 rounded-full pl-11 pr-4 py-2 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-500 shadow-inner"
            />
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="p-2 rounded-xl bg-[#0B1528] border border-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-blue-500/20">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left">
                  <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                    {currentUser.name || 'Abhi'}
                  </span>
                  <span className="text-[10px] text-slate-400 block leading-none">
                    @{currentUser.name?.toLowerCase().replace(/\s+/g, '') || 'member'}
                  </span>
                </div>
                <button 
                  onClick={onLogout}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                  title="Logout"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-md shadow-blue-500/20 transition-all"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}