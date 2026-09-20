import React, { useEffect, useState } from 'react';
import { User, Calendar, MessageSquare, ThumbsUp } from 'lucide-react';
import api from '../api';
import PostCard from '../components/PostCard';

export default function ProfilePage({ currentUser }) {
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        setLoading(true);
        const res = await api.get('/posts');
        const myPosts = (res.data || []).filter(p => p.author_id === currentUser?.id);
        setUserPosts(myPosts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (currentUser) fetchUserPosts();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="flex-1 py-12 text-center text-slate-400">
        Please sign in to view your profile.
      </div>
    );
  }

  return (
    <main className="flex-1 max-w-2xl space-y-6 pb-12">
      <div className="bg-[#0B1528] border border-slate-800 rounded-3xl p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-white text-2xl">
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{currentUser.name}</h1>
            <p className="text-xs text-slate-400">{currentUser.email}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
              {currentUser.role || 'Member'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="bg-[#030F26] p-3 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Published Opinions</p>
            <p className="text-lg font-bold text-white mt-1">{userPosts.length}</p>
          </div>
          <div className="bg-[#030F26] p-3 rounded-2xl border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Total Upvotes</p>
            <p className="text-lg font-bold text-white mt-1">
              {userPosts.reduce((acc, p) => acc + (Number(p.upvotes) || 0), 0)}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-bold text-slate-200 uppercase tracking-wider">My Discussions</h2>
        {loading ? (
          <p className="text-slate-500 text-xs">Loading opinions...</p>
        ) : userPosts.length === 0 ? (
          <p className="text-slate-500 text-xs">You have not published any opinions yet.</p>
        ) : (
          <div className="space-y-4">
            {userPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}