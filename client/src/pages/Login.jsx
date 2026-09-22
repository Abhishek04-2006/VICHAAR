import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../api';

const SLIDES = [
  {
    image: '/slide1.png',
    title: 'Open Campus Discourse',
    description: 'Engage with diverse perspectives in verified student debate chambers.'
  },
  {
    image: '/slide2.png',
    title: 'Publish Your Vichaar',
    description: 'Transform your thoughts into structured, engaging discussions.'
  },
  {
    image: '/slide3.png',
    title: 'Real-Time Engagement',
    description: 'Upvote meaningful arguments and participate in live threaded debates.'
  },
  {
    image: '/slide4.png',
    title: 'Democracy of Ideas',
    description: 'Ranked discussions driven entirely by campus community consensus.'
  }
];

export default function LoginPage({ onLoginSuccess }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Har 4 seconds mein smooth automatic slide change
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
      
      {/* Left Column: Visual Showcase & Dynamic Slideshow */}
      <div className="lg:w-1/2 bg-[#0B1528] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Branding */}
        {/* Top Branding */}
<div className="flex items-center gap-3.5 relative z-10">
  <div className="w-11 h-11 rounded-2xl overflow-hidden shadow-lg shadow-blue-500/25 border border-blue-500/30 flex items-center justify-center bg-[#070e1c]">
    <img
      src="/logo.png"
      alt="VICHAAR Logo"
      className="w-full h-full object-cover"
    />
  </div>
  <div>
    <span className="font-black text-white text-xl tracking-wide block leading-none">
      VICHAAR
    </span>
    <span className="text-[10px] text-blue-400 font-semibold tracking-widest uppercase mt-1 block">
      Opinion Sharing Platform
    </span>
  </div>
</div>

        {/* Center Slideshow Card */}
        <div className="my-8 relative z-10 flex flex-col items-center w-full">
          <div className="w-full relative h-[360px] sm:h-[400px] rounded-3xl overflow-hidden border border-slate-700/60 shadow-2xl shadow-black/60 bg-[#070e1c]">
            {SLIDES.map((slide, idx) => (
              <div
                key={idx}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />

                {/* Dark Gradient Overlay for Typography */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1528] via-[#0B1528]/50 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">
                    Spotlight {idx + 1} of {SLIDES.length}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight leading-snug">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-sm">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Pagination Navigation Dots */}
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-[#030712]/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700/50">
              {SLIDES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlide(dotIdx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    dotIdx === currentSlide
                      ? 'w-6 bg-blue-500'
                      : 'w-1.5 bg-slate-500 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
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

        {/* Footer */}
        <div className="relative z-10 border-t border-slate-800/80 pt-4">
          <p className="text-xs text-slate-500">
            "Different minds build a brighter tomorrow." &mdash; VICHAAR Campus Community
          </p>
        </div>
      </div>

      {/* Right Column: Video Background & Floating Form */}
      <div className="lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-[#050B17]">
        
        {/* Continuous Looping Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 scale-105"
        >
          <source src="/login-bg.mp4" type="video/mp4" />
        </video>

        {/* Backdrop Tint */}
        <div className="absolute inset-0 bg-[#030712]/70 backdrop-blur-[2px] z-0 pointer-events-none"></div>

        {/* Floating Glassmorphic Authentication Card */}
        <div className="w-full max-w-md relative z-10 bg-[#0B1528]/85 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-black/80">
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
            <div className="mb-5 p-3.5 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-300 text-xs font-medium">
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
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Abhishek Tiwari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#030F26]/90 border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#030F26]/90 border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#030F26]/90 border border-slate-700/80 focus:border-blue-500 rounded-xl pl-10 pr-3.5 py-3 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500"
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