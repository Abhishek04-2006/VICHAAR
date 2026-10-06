import React from 'react';
import { Search, Bell, LogOut, Award, CheckCircle2 } from 'lucide-react';

export default function Navbar({ currentUser, searchQuery, setSearchQuery, onOpenLogin, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-[#090A0D]/90 backdrop-blur-md border-b border-[#1A1C22]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3 w-56 sm:w-64 shrink-0">
          <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#272B36] shrink-0 bg-[#141720] flex items-center justify-center">
            <img 
              src="/logo.png" 
              alt="VICHAAR" 
              className="w-full h-full object-cover" 
            />
          </div>
          <div className="min-w-0">
            <span className="font-bold text-[#F4F4F5] text-base tracking-tight block leading-none truncate">
              VICHAAR
            </span>
            <span className="text-[9px] text-[#71717A] font-mono tracking-widest uppercase mt-1 block truncate">
              Campus Discourse
            </span>
          </div>
        </div>

        {/* Center: Search Bar aligned with feed */}
        <div className="flex-1 max-w-xl mx-auto">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#71717A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search opinions, topics, discussions..."
              className="w-full bg-[#111317] border border-[#22252E] focus:border-[#3E4452] rounded-xl pl-10 pr-4 py-2 text-xs text-[#EDEDED] outline-none transition-all placeholder:text-[#52525B]"
            />
          </div>
        </div>

        {/* Right: Notifications & User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                className="p-2 rounded-xl bg-[#111317] border border-[#22252E] text-[#8E929E] hover:text-[#F4F4F5] transition-colors"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 pl-3 border-l border-[#1F2228]">
                {/* Dynamic Real Avatar */}
                <div className="w-8 h-8 rounded-xl bg-[#181A20] border border-[#272B35] overflow-hidden flex items-center justify-center text-[#EDEDED] text-xs font-bold shrink-0">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'
                  )}
                </div>

                <div className="hidden sm:block text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold text-[#F4F4F5] block leading-tight truncate max-w-[110px]">
                      {currentUser.name || 'Member'}
                    </span>
                    {currentUser.badge === 'VERIFIED_DEBATER' && (
                      <Award className="w-3 h-3 text-blue-400 shrink-0" title="Top Debater" />
                    )}
                    {currentUser.badge === 'DELEGATE' && (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" title="Delegate" />
                    )}
                  </div>
                  <span className="text-[10px] text-[#71717A] font-mono block leading-none mt-0.5">
                    @{currentUser.name?.toLowerCase().replace(/\s+/g, '') || 'member'}
                  </span>
                </div>

                <button 
                  onClick={onLogout}
                  className="text-[#71717A] hover:text-rose-400 transition-colors p-1.5 rounded-lg hover:bg-[#181A20]"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenLogin}
              className="bg-[#EDEDED] hover:bg-white text-[#090A0D] text-xs font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Sign In
            </button>
          )}
        </div>

      </div>
    </header>
  );
}