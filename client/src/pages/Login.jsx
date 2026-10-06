import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 4500);
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
      setError(err.response?.data?.error || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Step 4: Real Google Identity Services Trigger & Backend Sync
  const handleGoogleAuth = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        setError('');

        // 1. Google UserInfo endpoint se user data fetch karo
        const userInfo = await axios.get(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        );

        // 2. Apne backend server ko Google payload send karo
        const res = await api.post('/auth/google', {
          name: userInfo.data.name,
          email: userInfo.data.email,
          avatar: userInfo.data.picture,
          googleId: userInfo.data.sub
        });

        // 3. Token store karke homepage navigate karo
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.user));
          if (onLoginSuccess) onLoginSuccess(res.data.user);
          navigate('/');
        }
      } catch (err) {
        console.error('Google Auth Error:', err);
        setError(err.response?.data?.error || 'Google authentication failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      setError('Google Sign-In was cancelled or failed to initialize.');
    }
  });

  return (
    <div className="min-h-screen bg-[#090A0D] flex flex-col lg:flex-row text-[#EDEDED] font-sans selection:bg-blue-600 selection:text-white">
      
      {/* Left Column: Visual Showcase & Grounded Carousel */}
      <div className="lg:w-1/2 bg-[#0E1015] border-b lg:border-b-0 lg:border-r border-[#1B1E26] flex flex-col justify-between p-8 sm:p-12 relative overflow-hidden">
        
        {/* Subtle Ambient Light */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Branding */}
        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#272B36] flex items-center justify-center bg-[#141720]">
            <img src="/logo.png" alt="VICHAAR Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <span className="font-bold text-[#F4F4F5] text-lg tracking-tight block leading-none">
              VICHAAR
            </span>
            <span className="text-[10px] text-[#71717A] font-mono tracking-widest uppercase mt-1 block">
              Opinion Sharing Platform
            </span>
          </div>
        </div>

        {/* Center Slideshow Card */}
        <div className="my-8 relative z-10 flex flex-col items-center w-full">
          <div className="w-full relative h-[380px] sm:h-[420px] rounded-2xl overflow-hidden border border-[#1F2228] shadow-2xl bg-[#090A0D]">
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

                {/* Neutral Charcoal Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0E1015] via-[#0E1015]/60 to-transparent flex flex-col justify-end p-6 sm:p-8">
                  <span className="text-[10px] font-mono font-semibold text-[#8E929E] tracking-wider uppercase mb-1.5">
                    Feature 0{idx + 1} / 0{SLIDES.length}
                  </span>
                  <h3 className="text-xl font-bold text-[#F4F4F5] tracking-tight leading-snug">
                    {slide.title}
                  </h3>
                  <p className="text-xs text-[#A1A1AA] mt-1.5 leading-relaxed max-w-sm">
                    {slide.description}
                  </p>
                </div>
              </div>
            ))}

            {/* Linear-Style Indicators */}
            <div className="absolute bottom-4 right-5 z-20 flex items-center gap-1.5 bg-[#090A0D]/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#272B36]">
              {SLIDES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={() => setCurrentSlide(dotIdx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    dotIdx === currentSlide
                      ? 'w-5 bg-[#EDEDED]'
                      : 'w-1 bg-[#52525B] hover:bg-[#71717A]'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center gap-6 text-[#71717A] text-xs font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400/90" />
              <span>Verified Discussions</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400/90" />
              <span>Real-time Upvoting</span>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="relative z-10 border-t border-[#1B1E26] pt-4">
          <p className="text-[11px] text-[#52525B]">
            "Different minds build a brighter tomorrow." &mdash; VICHAAR Platform
          </p>
        </div>
      </div>

      {/* Right Column: Looping Video & Floating Editorial Card */}
      <div className="lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12 overflow-hidden bg-[#090A0D]">
        
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

        {/* High-Contrast Tint */}
        <div className="absolute inset-0 bg-[#090A0D]/75 backdrop-blur-[3px] z-0 pointer-events-none"></div>

        {/* Floating Auth Card */}
        <div className="w-full max-w-md relative z-10 bg-[#111317]/90 backdrop-blur-xl border border-[#22252E] rounded-2xl p-7 sm:p-9 shadow-2xl">
          <div className="text-left mb-6">
            <h1 className="text-2xl font-bold text-[#F4F4F5] tracking-tight">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-[#8E929E] mt-1.5">
              {isRegister
                ? 'Join the campus network and share your perspective.'
                : 'Enter your credentials to publish and debate opinions.'}
            </p>
          </div>

          {/* 1-Click Google Auth Option */}
          <button
            type="button"
            onClick={() => handleGoogleAuth()}
            disabled={loading}
            className="w-full bg-[#16181E] hover:bg-[#1E2128] border border-[#272B35] hover:border-[#3A3F4D] text-[#E4E4E7] text-xs font-medium py-2.5 px-4 rounded-xl flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.99] shadow-sm disabled:opacity-50"
          >
            {/* Crisp Official 4-Color Google Vector */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.14z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.4 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.16 0 9.94 0 12s.45 3.84 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.6 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
          </button>

          {/* Clean Editorial Divider */}
          <div className="relative my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#22252E]"></div>
            </div>
            <span className="relative bg-[#111317] px-3 text-[11px] text-[#5A606D] font-mono uppercase tracking-wider">
              or continue with email
            </span>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <div>
                <label className="block text-[11px] font-mono text-[#8E929E] mb-1 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="e.g. Abhishek Tiwari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#090A0D] border border-[#262931] focus:border-[#4B5563] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F4F4F5] outline-none transition-all placeholder:text-[#52525B]"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-[#8E929E] mb-1 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#090A0D] border border-[#262931] focus:border-[#4B5563] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F4F4F5] outline-none transition-all placeholder:text-[#52525B]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8E929E] mb-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#71717A] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#090A0D] border border-[#262931] focus:border-[#4B5563] rounded-xl pl-10 pr-3.5 py-2.5 text-xs text-[#F4F4F5] outline-none transition-all placeholder:text-[#52525B]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#EDEDED] hover:bg-white text-[#090A0D] font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all mt-1 active:scale-[0.99] disabled:opacity-50"
            >
              <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-[#71717A] border-t border-[#1F2228] pt-4">
            {isRegister ? (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setIsRegister(false);
                  }}
                  className="text-[#EDEDED] hover:underline font-semibold ml-1"
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
                  className="text-[#EDEDED] hover:underline font-semibold ml-1"
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