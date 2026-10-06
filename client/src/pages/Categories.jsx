import React from 'react';
import { Cpu, School, Landmark, Users2, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

const CATEGORY_HUBS = [
  {
    id: 'Tech',
    name: 'Tech & AI',
    tag: 'Tech',
    desc: 'AI breakthroughs, engineering debates, tech layoffs, and campus developer projects.',
    icon: Cpu,
    color: 'text-blue-400',
    borderHover: 'hover:border-blue-500/40',
    badge: 'High Velocity'
  },
  {
    id: 'Campus',
    name: 'Campus Life',
    tag: 'Campus',
    desc: 'College administration updates, placement cell policies, fests, and hostel governance.',
    icon: School,
    color: 'text-emerald-400',
    borderHover: 'hover:border-emerald-500/40',
    badge: 'Active Hub'
  },
  {
    id: 'Governance',
    name: 'Public Policy',
    tag: 'Governance',
    desc: 'University mandates, NEP implementation, institutional reforms, and civil debates.',
    icon: Landmark,
    color: 'text-amber-400',
    borderHover: 'hover:border-amber-500/40',
    badge: 'Deliberation'
  },
  {
    id: 'Society',
    name: 'Society & Culture',
    tag: 'Society',
    desc: 'Collective youth perspectives, student mental wellbeing, ethics, and social change.',
    icon: Users2,
    color: 'text-purple-400',
    borderHover: 'hover:border-purple-500/40',
    badge: 'Open Forum'
  },
  {
    id: 'Economy',
    name: 'Economy & Markets',
    tag: 'Economy',
    desc: 'Venture capital funding, fintech startups, inflation, and entry-level career economy.',
    icon: TrendingUp,
    color: 'text-rose-400',
    borderHover: 'hover:border-rose-500/40',
    badge: 'Analysis'
  },
];

export default function CategoriesPage({ onSelectCategory }) {
  return (
    <div className="flex-1 max-w-4xl pb-16 space-y-6">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#1F2228]">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <h1 className="text-xl font-bold text-[#F4F4F5] tracking-tight">
            Discourse Chambers
          </h1>
        </div>
        <p className="text-xs text-[#8E929E]">
          Select a verified topic chamber to filter campus opinions and structured arguments.
        </p>
      </div>

      {/* Modern Charcoal Chambers Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {CATEGORY_HUBS.map((hub) => {
          const Icon = hub.icon;
          return (
            <div
              key={hub.id}
              onClick={() => onSelectCategory && onSelectCategory(hub.tag)}
              className={`bg-[#111317] border border-[#1F2228] ${hub.borderHover} p-5 rounded-2xl cursor-pointer transition-all duration-200 group flex flex-col justify-between hover:-translate-y-0.5 shadow-sm hover:shadow-lg hover:shadow-black/50`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-[#181A20] border border-[#272B35] flex items-center justify-center">
                    <Icon className={`w-4 h-4 ${hub.color}`} />
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181A20] text-[#71717A] border border-[#262931]">
                    {hub.badge}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-[#F4F4F5] group-hover:text-white transition-colors">
                  #{hub.name}
                </h3>
                <p className="text-xs text-[#8E929E] mt-1.5 leading-relaxed">
                  {hub.desc}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#181A20] text-xs font-mono text-[#71717A] group-hover:text-[#EDEDED] transition-colors">
                <span>Enter Chamber</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}