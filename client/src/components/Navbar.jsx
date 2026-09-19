import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, User as UserIcon, LogIn } from 'lucide-react';

export default function Navbar({
  currentUser: user,
  onOpenLogin,
  onLogout,
  searchQuery,
  setSearchQuery,
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-[#030712]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer select-none">
          <div className="w-9 h-9 rounded-xl bg-[#0066FF] flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-black text-lg tracking-wider">V</span>
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-wide block leading-none">
              VICHAAR
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
              Share Your Thoughts
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg mx-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search opinions, topics, discussions..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
              className="w-full bg-[#0B1528] border border-slate-800 focus:border-blue-500 text-slate-200 placeholder:text-slate-500 text-xs rounded-xl pl-10 pr-4 py-2 transition-all outline-none"
            />
          </div>
        </div>

        {/* Right Actions / Auth State */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                <Bell className="w-4 h-4" />
                <span className="w-2 h-2 rounded-full bg-blue-500 absolute top-2 right-2 ring-2 ring-[#030712]"></span>
              </button>

              {/* Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown((prev) => !prev)}
                  className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all"
                >
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-xs">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-white leading-none">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-400 leading-none mt-1">
                      @{user?.email ? user.email.split('@')[0] : 'member'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-[#0B1528] border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50">
                    <div className="px-3.5 py-2 border-b border-slate-800 text-xs text-slate-300">
                      Signed in as <span className="font-semibold text-white">{user?.name}</span>
                    </div>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        if (onLogout) onLogout();
                      }}
                      className="w-full px-3.5 py-2 text-left text-xs text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-semibold px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/20"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}