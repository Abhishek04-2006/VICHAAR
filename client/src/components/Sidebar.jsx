import React from 'react';
import {
  Home,
  Compass,
  TrendingUp,
  Bookmark,
  User,
  Settings,
  PlusCircle,
  Quote
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenPostModal,
  onOpenLogin
}) {
  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'categories', label: 'Categories', icon: Compass },
    { id: 'top', label: 'Top Discussions', icon: TrendingUp },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleMenuClick = (id) => {
    if ((id === 'bookmarks' || id === 'profile') && !currentUser) {
      onOpenLogin();
      return;
    }
    setActiveTab(id);
  };

  return (
    <aside className="w-64 hidden md:flex flex-col justify-between shrink-0 sticky top-20 h-[calc(100vh-6rem)] pb-4">
      <div className="space-y-6">
        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-500/25'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Publish Action Button */}
        <button
          onClick={onOpenPostModal}
          className="w-full bg-[#0066FF] hover:bg-blue-600 text-white text-xs font-bold py-3 px-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Opinion</span>
        </button>
      </div>

      {/* Philosophy Card */}
      <div className="p-4 rounded-2xl bg-[#0B1528] border border-slate-800/80 space-y-2">
        <Quote className="w-4 h-4 text-blue-500" />
        <p className="text-[11px] italic text-slate-400 leading-relaxed">
          "Different minds build a brighter tomorrow."
        </p>
        <span className="text-[10px] font-bold tracking-wider text-slate-500 uppercase block">
          — VICHAAR
        </span>
      </div>
    </aside>
  );
}