import React from 'react';
import { TrendingUp, Users } from 'lucide-react';

const CATEGORIES = [
  { name: 'Tech & AI', count: '1.2K opinions' },
  { name: 'Higher Education', count: '890 opinions' },
  { name: 'Public Policy', count: '654 opinions' },
  { name: 'Campus Life', count: '430 opinions' },
];

const SUGGESTIONS = [
  { name: 'Rohan Mehta', role: 'Student Delegate' },
  { name: 'Ananya Verma', role: 'Policy Researcher' },
  { name: 'Karan Johar', role: 'Tech Enthusiast' },
];

export default function Widgets() {
  return (
    <aside className="w-80 shrink-0 py-6 space-y-6 hidden lg:block">
      {/* Trending Categories */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Trending Categories
          </h3>
          <span className="text-xs text-blue-400 cursor-pointer hover:underline">View all</span>
        </div>
        <div className="space-y-3">
          {CATEGORIES.map((c) => (
            <div key={c.name} className="flex items-center justify-between text-sm group cursor-pointer">
              <span className="text-slate-300 group-hover:text-blue-400 transition-colors font-medium">
                #{c.name}
              </span>
              <span className="text-xs text-slate-500">{c.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Community Recommendations */}
      <div className="bg-[#0B1528] border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-400" />
          Who to Follow
        </h3>
        <div className="space-y-3.5">
          {SUGGESTIONS.map((person) => (
            <div key={person.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-semibold">
                  {person.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{person.name}</p>
                  <p className="text-[11px] text-slate-400">{person.role}</p>
                </div>
              </div>
              <button className="text-xs font-semibold px-3 py-1.5 bg-blue-600/10 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg border border-blue-500/20 transition-all">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}