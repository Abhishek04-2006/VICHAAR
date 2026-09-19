import React from 'react';
import { Home, Compass, Flame, Bookmark, User, Settings, PlusCircle } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', icon: Home, active: true },
  { label: 'Categories', icon: Compass },
  { label: 'Top Discussions', icon: Flame },
  { label: 'Bookmarks', icon: Bookmark },
  { label: 'My Profile', icon: User },
  { label: 'Settings', icon: Settings },
];

export default function Sidebar({ onOpenCreateModal }) {
  return (
    <aside className="w-64 shrink-0 flex flex-col justify-between py-6 pr-6">
      <div className="space-y-6">
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  item.active
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            );
          })}
        </nav>

        <button
          onClick={onOpenCreateModal}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-600/30 transition-all active:scale-[0.98]"
        >
          <PlusCircle className="w-5 h-5" />
          Publish Opinion
        </button>
      </div>

      <div className="p-4 rounded-2xl bg-[#0B1528] border border-slate-800/80 text-xs text-slate-400 space-y-2">
        <p className="italic text-slate-300">
          "Different minds build a brighter tomorrow."
        </p>
        <span className="block text-[11px] font-semibold text-blue-400 uppercase tracking-wider">
          — VICHAAR
        </span>
      </div>
    </aside>
  );
}