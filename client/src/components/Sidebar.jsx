import React from 'react';
import { useLocation } from 'react-router-dom';
import {
  Home,
  Compass,
  TrendingUp,
  Bookmark,
  User,
  Settings,
  Plus,
  Quote
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenPostModal,
  onOpenLogin
}) {
  const location = useLocation();

  // Current path ke hisaab se dynamic active state evaluate karna
  const currentPath = location.pathname;
  const currentTab = 
    currentPath === '/' ? 'home' :
    currentPath.startsWith('/categories') ? 'categories' :
    currentPath.startsWith('/profile') ? 'profile' :
    activeTab;

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
    <aside className="w-60 hidden md:flex flex-col justify-between shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] pb-4 select-none">
      <div className="space-y-5">
        {/* Navigation Items */}
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-[13px] font-medium transition-colors ${
                  isActive
                    ? 'bg-[#181A20] text-[#F4F4F5] border border-[#272A34]'
                    : 'text-[#8E929E] hover:text-[#F4F4F5] hover:bg-[#121418] border border-transparent'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#F4F4F5]' : 'text-[#71717A]'
                  }`}
                />
                <span className="tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Publish Action Button */}
        <button
          onClick={onOpenPostModal}
          className="w-full bg-[#EDEDED] hover:bg-white active:scale-[0.99] text-[#090A0D] text-xs font-semibold py-2.5 px-3.5 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm shadow-white/5"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Publish Opinion</span>
        </button>
      </div>

      {/* Grounded Philosophy Card */}
      <div className="p-3.5 rounded-xl bg-[#111317] border border-[#1F2228] space-y-1.5">
        <div className="flex items-center gap-1.5 text-[#52525B]">
          <Quote className="w-3.5 h-3.5" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A]">
            Charter
          </span>
        </div>
        <p className="text-[11px] text-[#A1A1AA] leading-relaxed">
          "Different minds build a brighter tomorrow."
        </p>
        <span className="text-[10px] font-semibold text-[#52525B] block pt-0.5">
          VICHAAR Campus
        </span>
      </div>
    </aside>
  );
}