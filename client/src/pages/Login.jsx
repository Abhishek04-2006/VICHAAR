import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../api';

export default function LoginPage({ onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister ? { name, email, password } : { email, password };

      const res = await api.post(endpoint, payload);

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        if (onLoginSuccess) onLoginSuccess(res.data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Authentication failed. Kripya details check karein.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col lg:flex-row text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      {/* Left Column: Visual Showcase & Onboarding Banner */}
      <div className="lg:w-1/2 bg-[#0B1528] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Branding */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-2xl bg-[#0066FF] flex items-center justify-center shadow-lg shadow-blue-500/25">
            <span className="text-white font-black text-xl tracking-wider">V</span>
          </div>
          <div>
            <span className="font-extrabold text-white text-lg tracking-wide block leading-none">
              VICHAAR
            </span>
            <span className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">
              Opinion Sharing Platform
            </span>
          </div>
        </div>

        {/* Center Banner Graphic Card */}
        <div className="my-8 relative z-10 flex flex-col items-center">
          <div className="w-full rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/50 bg-[#070e1c] group">
            <img
              src="/onboarding-banner.png"
              alt="VICHAAR Workflow - Simple Fast Effective"
              className="w-full h-auto object-cover object-center transition-transform duration-500 group-hover:scale-[1.01]"
              onError={(e) => {
                // Agar file load na ho toh fallback design
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="mt-6 flex items-center gap-6 text-slate-400 text-xs font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Verified Discussions</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Real-time Upvoting</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-500">
            "Different minds build a brighter tomorrow." &mdash; VICHAAR Campus Community
          </p>
        </div>
      </div>

      {/* Right Column: Authentication Form */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-[#0B1528]/80 backdrop-blur-xl border border-slate-800/90 rounded-3xl p-8 shadow-2xl relative">
          <div className="text-left mb-6">
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {isRegister
                ? 'Join our campus network and share your perspective.'
                : 'Enter your credentials to publish and debate opinions.'}
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Abhishek Tiwari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#030F26] border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#030F26] border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#030F26] border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-200 outline-none transition-all placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0066FF] hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/25 mt-2 active:scale-[0.99]"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-400 border-t border-slate-800/80 pt-5">
            {isRegister ? (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setIsRegister(false);
                  }}
                  className="text-blue-400 hover:text-blue-300 underline font-semibold ml-1"
                >
                  Sign In
                </button>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setIsRegister(true);
                  }}
                  className="text-blue-400 hover:text-blue-300 underline font-semibold ml-1"
                >
                  Create one now
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}