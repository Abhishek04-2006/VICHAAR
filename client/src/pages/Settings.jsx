import React from 'react';
import { Settings as SettingsIcon, Sun, Moon, ShieldCheck, Mail, Palette } from 'lucide-react';

export default function SettingsPage({ currentUser, theme, onToggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <div className="flex-1 max-w-4xl pb-16 space-y-6">
      {/* Platform Settings Header */}
      <div className="pb-4 border-b border-[#E2E8F0] dark:border-[#1F2228]">
        <div className="flex items-center gap-2 mb-1">
          <SettingsIcon className="w-5 h-5 text-blue-500" />
          <h1 className="text-xl font-bold text-[#0F172A] dark:text-[#F4F4F5] tracking-tight">
            Platform Settings
          </h1>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#8E929E]">
          Manage your account credentials and feed personalization.
        </p>
      </div>

      <div className="space-y-4">
        {/* Account Email Card */}
        <div className="bg-white dark:bg-[#111317] border border-[#E2E8F0] dark:border-[#1F2228] p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] dark:text-[#F4F4F5]">
              <Mail className="w-4 h-4 text-[#64748B] dark:text-[#71717A]" />
              <span>Account Email</span>
            </div>
            <p className="text-xs font-mono text-[#64748B] dark:text-[#71717A] mt-1">
              {currentUser?.email || 'user@campus.edu'}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-3.5 h-3.5" />
            Verified Member
          </span>
        </div>

        {/* Theme Appearance Toggle Card */}
        <div className="bg-white dark:bg-[#111317] border border-[#E2E8F0] dark:border-[#1F2228] p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-[#0F172A] dark:text-[#F4F4F5]">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Theme Appearance</span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#8E929E] mt-1">
              {isDark
                ? 'Obsidian Dark Mode with cobalt accents active'
                : 'Clean Light Slate Mode active'}
            </p>
          </div>

          {/* Interactive Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-medium transition-all duration-200 cursor-pointer active:scale-95 shadow-sm ${
              isDark
                ? 'bg-[#181A20] border-[#272B35] text-[#EDEDED] hover:border-blue-500/50'
                : 'bg-[#F1F5F9] border-[#CBD5E1] text-[#0F172A] hover:border-blue-500/50'
            }`}
          >
            {isDark ? (
              <>
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Dark Active</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Light Active</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}