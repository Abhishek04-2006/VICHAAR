import React, { useState } from 'react';
import { TrendingUp, Users, Check, Plus } from 'lucide-react';

const TRENDING_TOPICS = [
  { tag: 'Tech', label: '#Tech & AI', count: '1.2k opinions' },
  { tag: 'Campus', label: '#Campus Life', count: '430 opinions' },
  { tag: 'Governance', label: '#Public Policy', count: '654 opinions' },
  { tag: 'Society', label: '#Higher Education', count: '890 opinions' },
];

const INITIAL_SUGGESTIONS = [
  { id: 1, name: 'Rohan Mehta', role: 'Student Delegate', initial: 'R' },
  { id: 2, name: 'Ananya Verma', role: 'Policy Researcher', initial: 'A' },
  { id: 3, name: 'Karan Johar', role: 'Tech Enthusiast', initial: 'K' },
];

export default function Widgets({ onCategoryClick }) {
  const [following, setFollowing] = useState({});

  const toggleFollow = (id) => {
    setFollowing((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className="w-80 hidden lg:flex flex-col gap-5 shrink-0 sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto scrollbar-none pb-6">
      {/* Trending Categories Widget */}
      <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Trending Categories
            </h3>
          </div>
          <span className="text-[10px] text-blue-400 font-semibold cursor-pointer hover:underline">
            View all
          </span>
        </div>

        <div className="space-y-1">
          {TRENDING_TOPICS.map((item) => (
            <button
              key={item.tag}
              onClick={() => onCategoryClick && onCategoryClick(item.tag)}
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-900/80 transition-all text-left group"
            >
              <div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-blue-400 transition-colors">
                  {item.label}
                </p>
                <p className="text-[10px] text-slate-500">{item.count}</p>
              </div>
              <span className="text-[10px] bg-slate-900 text-slate-400 group-hover:text-white px-2 py-1 rounded-lg border border-slate-800">
                Explore
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Who to Follow Widget */}
      <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-4 shadow-xl">
        <div className="flex items-center gap-2 mb-3.5">
          <Users className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Who to Follow
          </h3>
        </div>

        <div className="space-y-3">
          {INITIAL_SUGGESTIONS.map((person) => {
            const isFollowed = following[person.id];
            return (
              <div key={person.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center shrink-0">
                    {person.initial}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate leading-tight">
                      {person.name}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate leading-tight mt-0.5">
                      {person.role}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => toggleFollow(person.id)}
                  className={`text-[11px] font-semibold px-3 py-1.5 rounded-xl border transition-all flex items-center gap-1 shrink-0 ${
                    isFollowed
                      ? 'bg-slate-800 border-slate-700 text-emerald-400'
                      : 'bg-[#0066FF] hover:bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20'
                  }`}
                >
                  {isFollowed ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}