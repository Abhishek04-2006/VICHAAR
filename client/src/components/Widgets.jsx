import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Check, Plus, Award, CheckCircle2 } from 'lucide-react';
import api from '../api';

const CATEGORIES = [
  { tag: 'Tech', label: '#Tech & AI' },
  { tag: 'Campus', label: '#Campus Life' },
  { tag: 'Governance', label: '#Public Policy' },
  { tag: 'Society', label: '#Society & Culture' },
  { tag: 'Economy', label: '#Economy & Markets' },
];

export default function Widgets({ onCategoryClick }) {
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [following, setFollowing] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Fetch real active users from MySQL database
  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const res = await api.get('/users/recommended');
        if (isMounted) {
          setRecommendedUsers(res.data || []);
        }
      } catch (err) {
        console.error('Failed to load recommended users:', err);
      } finally {
        if (isMounted) {
          setLoadingUsers(false);
        }
      }
    };

    fetchUsers();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleFollow = (id) => {
    setFollowing((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside className="w-80 hidden lg:flex flex-col gap-4 shrink-0 sticky top-20 h-[calc(100vh-5.5rem)] overflow-y-auto scrollbar-none pb-6 select-none">
      
      {/* 1. Discourse Hubs / Categories */}
      <div className="bg-[#111317] border border-[#1F2228] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A1C22]">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#8E929E]" />
            <h3 className="text-[11px] font-mono font-semibold text-[#8E929E] uppercase tracking-wider">
              Discourse Hubs
            </h3>
          </div>
          <button 
            onClick={() => onCategoryClick && onCategoryClick('All')}
            className="text-[11px] text-[#A1A1AA] hover:text-white transition-colors"
          >
            All
          </button>
        </div>

        <div className="space-y-1">
          {CATEGORIES.map((item) => (
            <button
              key={item.tag}
              onClick={() => onCategoryClick && onCategoryClick(item.tag)}
              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-[#181A20] transition-colors text-left group"
            >
              <div>
                <p className="text-xs font-medium text-[#D4D4D8] group-hover:text-white transition-colors">
                  {item.label}
                </p>
                <p className="text-[10px] text-[#71717A] font-mono">Verified Debate</p>
              </div>
              <span className="text-[10px] bg-[#181A20] text-[#8E929E] group-hover:text-[#F4F4F5] px-2 py-0.5 rounded border border-[#262931] transition-colors">
                Explore
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Active Voices / Recommended Users */}
      <div className="bg-[#111317] border border-[#1F2228] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#1A1C22]">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#8E929E]" />
            <h3 className="text-[11px] font-mono font-semibold text-[#8E929E] uppercase tracking-wider">
              Active Voices
            </h3>
          </div>
          <span className="text-[10px] text-[#52525B] font-mono">Live</span>
        </div>

        <div className="space-y-2.5">
          {loadingUsers ? (
            <div className="py-4 text-center text-xs text-[#71717A]">
              Connecting to campus network...
            </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="py-3 text-center text-xs text-[#71717A]">
              No other active delegates yet.
            </div>
          ) : (
            recommendedUsers.map((person) => {
              const isFollowed = following[person.id];
              return (
                <div key={person.id} className="flex items-center justify-between gap-3 p-1 rounded-lg">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-[#181A20] border border-[#272B35] text-[#D4D4D8] text-[11px] font-bold flex items-center justify-center shrink-0 overflow-hidden">
                      {person.avatar ? (
                        <img 
                          src={person.avatar} 
                          alt={person.name} 
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        person.name ? person.name.charAt(0).toUpperCase() : 'U'
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-xs font-medium text-[#F4F4F5] truncate leading-tight">
                          {person.name}
                        </p>
                        {person.badge === 'VERIFIED_DEBATER' && (
                          <Award className="w-3 h-3 text-blue-400 shrink-0" />
                        )}
                        {person.badge === 'DELEGATE' && (
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-[10px] font-mono text-[#71717A] truncate leading-tight mt-0.5">
                        {person.department ? `${person.department} • ` : ''}
                        {person.post_count || 0} {person.post_count === 1 ? 'opinion' : 'opinions'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleFollow(person.id)}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1 shrink-0 active:scale-[0.98] ${
                      isFollowed
                        ? 'bg-[#181A20] border-[#2E323D] text-emerald-400'
                        : 'bg-[#EDEDED] hover:bg-white text-[#090A0D] border-transparent font-semibold'
                    }`}
                  >
                    {isFollowed ? (
                      <>
                        <Check className="w-3 h-3 stroke-[2.5]" />
                        <span>Connected</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3 h-3 stroke-[2.5]" />
                        <span>Connect</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
}