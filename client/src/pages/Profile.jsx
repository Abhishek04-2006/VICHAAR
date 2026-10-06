import React, { useState, useEffect, useRef } from 'react';
import { Camera, Mail, Award, CheckCircle2, ShieldCheck, Sparkles, MessageSquare, Flame } from 'lucide-react';
import PostCard from '../components/Postcard';
import api from '../api';

export default function ProfilePage({ currentUser, onUserUpdate }) {
  const [user, setUser] = useState(currentUser);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Load latest profile data and posts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        const [meRes, postsRes] = await Promise.all([
          api.get('/auth/me'),
          api.get('/posts')
        ]);
        
        setUser(meRes.data);
        const mine = (postsRes.data || []).filter(p => p.author_id === meRes.data.id);
        setUserPosts(mine);
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProfileData();
  }, []);

  // Client-Side Canvas Image Compression & Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = async () => {
        // High-performance canvas downsampling
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Web-optimized compressed base64 (~40-60KB)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.85);

        try {
          setUploading(true);
          const res = await api.put('/users/profile', { avatar: compressedBase64 });
          
          const updatedUser = { ...user, avatar: compressedBase64 };
          setUser(updatedUser);
          
          // Sync localStorage
          const localUser = JSON.parse(localStorage.getItem('user') || '{}');
          localStorage.setItem('user', JSON.stringify({ ...localUser, avatar: compressedBase64 }));
          
          if (onUserUpdate) onUserUpdate(updatedUser);
        } catch (err) {
          console.error('Failed to update avatar:', err);
          alert('Could not update avatar. Make sure backend is running.');
        } finally {
          setUploading(false);
        }
      };
    };
  };

  const totalUpvotes = userPosts.reduce((acc, curr) => acc + (Number(curr.upvotes) || 0), 0);

  return (
    <div className="flex-1 max-w-4xl pb-16 space-y-6">
      
      {/* 1. High-End Profile Header Card */}
      <div className="bg-[#111317] border border-[#1F2228] rounded-2xl overflow-hidden shadow-xl">
        
        {/* Campus Graphic Banner */}
        <div className="h-36 bg-gradient-to-r from-[#141822] via-[#1E2330] to-[#12151C] relative border-b border-[#1F2228]">
          <div className="absolute inset-0 bg-[radial-gradient(#272B36_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>
        </div>

        <div className="px-6 sm:px-8 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            
            {/* Avatar Section with Real Avatar Display */}
            <div className="relative group w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-[#090A0D] bg-[#181A20] overflow-hidden shrink-0 shadow-2xl">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl text-[#EDEDED]">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}

              {/* Upload Trigger Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white cursor-pointer backdrop-blur-xs"
                title="Change Avatar"
              >
                <Camera className="w-5 h-5 mb-0.5" />
                <span className="text-[9px] font-mono tracking-wider uppercase font-semibold">
                  {uploading ? 'Saving...' : 'Upload'}
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Badges / Chips */}
            <div className="flex items-center gap-2">
              {user?.badge === 'VERIFIED_DEBATER' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/25">
                  <Award className="w-3.5 h-3.5 stroke-[2.2]" />
                  Top Debater
                </span>
              )}
              {user?.badge === 'DELEGATE' && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.2]" />
                  Campus Delegate
                </span>
              )}
              <span className="text-xs font-mono px-3 py-1 rounded-lg bg-[#181A20] text-[#A1A1AA] border border-[#272B35]">
                {user?.department || 'BCA'}
              </span>
            </div>
          </div>

          {/* User Name & Bio Details */}
          <div>
            <h1 className="text-2xl font-bold text-[#F4F4F5] tracking-tight">{user?.name}</h1>
            <div className="flex items-center gap-2 text-xs text-[#71717A] mt-1 font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </div>
            <p className="text-xs text-[#A1A1AA] mt-3 leading-relaxed max-w-xl">
              {user?.bio || 'Campus Thinker & Active Debater'}
            </p>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-[#1F2228]">
            <div className="bg-[#181A20] border border-[#262931] p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-[#71717A] text-[11px] font-mono uppercase tracking-wider mb-1">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Opinions</span>
              </div>
              <span className="text-xl font-bold text-[#F4F4F5]">{userPosts.length}</span>
            </div>

            <div className="bg-[#181A20] border border-[#262931] p-3.5 rounded-xl">
              <div className="flex items-center gap-2 text-emerald-400/90 text-[11px] font-mono uppercase tracking-wider mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Reputation</span>
              </div>
              <span className="text-xl font-bold text-[#F4F4F5]">{totalUpvotes}</span>
            </div>

            <div className="bg-[#181A20] border border-[#262931] p-3.5 rounded-xl col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-blue-400/90 text-[11px] font-mono uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Credibility</span>
              </div>
              <span className="text-xl font-bold text-[#F4F4F5]">
                {totalUpvotes > 20 ? 'Active Delegate' : 'Student Voice'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. User's Personal Discussions Stream */}
      <div className="space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#1F2228]">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#A1A1AA] font-mono">
            My Published Discourse ({userPosts.length})
          </h2>
        </div>

        {loading ? (
          <div className="py-8 text-center text-xs text-[#71717A]">Loading your vichaar...</div>
        ) : userPosts.length === 0 ? (
          <div className="p-8 text-center bg-[#111317] border border-[#1F2228] rounded-xl text-xs text-[#71717A]">
            You have not initiated any discourse yet. Click "+ Publish Opinion" to start.
          </div>
        ) : (
          <div className="space-y-3.5">
            {userPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}