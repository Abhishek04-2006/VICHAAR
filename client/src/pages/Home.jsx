import React, { useState, useEffect } from 'react';
import Widgets from '../components/Widgets';
import PostCard from '../components/PostCard';
import CreatePostModal from '../components/CreatePostModal';
import { Compass, Bookmark, TrendingUp, Settings as SettingsIcon, Sliders, Shield, Bell } from 'lucide-react';
import api from '../api';

const CATEGORIES = ['All', 'Tech', 'Campus', 'Governance', 'Society', 'Economy'];

const CATEGORY_CARDS = [
  { name: 'Tech', desc: 'AI breakthroughs, engineering debates, and future gadgets.', color: 'from-blue-600/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { name: 'Campus', desc: 'College events, placements, campus life, and admin updates.', color: 'from-emerald-600/20 to-teal-500/20', border: 'border-emerald-500/30' },
  { name: 'Governance', desc: 'Policy discussions, university mandates, and civic systems.', color: 'from-purple-600/20 to-violet-500/20', border: 'border-purple-500/30' },
  { name: 'Society', desc: 'Culture, collective perspectives, and social change.', color: 'from-amber-600/20 to-orange-500/20', border: 'border-amber-500/30' },
  { name: 'Economy', desc: 'Tech layoffs, market trends, startups, and economic outlook.', color: 'from-rose-600/20 to-pink-500/20', border: 'border-rose-500/30' },
];

export default function HomePage({
  currentUser,
  onOpenLogin,
  searchQuery,
  selectedCategory,
  setSelectedCategory,
  activeTab,
  onOpenPostModal
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedPostIds, setSavedPostIds] = useState(() => {
    return JSON.parse(localStorage.getItem('bookmarked_posts') || '[]');
  });

  const fetchPosts = async (cat = selectedCategory) => {
    try {
      setLoading(true);
      const url = cat && cat !== 'All' ? `/posts?category=${cat}` : '/posts';
      const res = await api.get(url);
      setPosts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(selectedCategory);
  }, [selectedCategory]);

  const handleBookmarkToggle = (postId) => {
    const updated = savedPostIds.includes(postId)
      ? savedPostIds.filter((id) => id !== postId)
      : [...savedPostIds, postId];
    setSavedPostIds(updated);
    localStorage.setItem('bookmarked_posts', JSON.stringify(updated));
  };

  // Filter based on Search & Active Tab
  const filteredPosts = posts
    .filter((post) => {
      const matchesSearch =
        post.title?.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
        post.content?.toLowerCase().includes((searchQuery || '').toLowerCase());
      
      if (!matchesSearch) return false;

      if (activeTab === 'bookmarks') {
        return savedPostIds.includes(post.id);
      }
      return true;
    })
    .sort((a, b) => {
      if (activeTab === 'top') {
        return (b.upvotes || 0) - (a.upvotes || 0);
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return (
    <>
      <main className="flex-1 max-w-2xl space-y-6 pb-12">
        {/* 1. CATEGORIES VIEW */}
        {activeTab === 'categories' && (
          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <Compass className="w-6 h-6 text-blue-500" />
                Explore Categories
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Browse curated debate chambers and focused discussion zones
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {CATEGORY_CARDS.map((item) => (
                <div
                  key={item.name}
                  onClick={() => setSelectedCategory(item.name)}
                  className={`p-4 rounded-2xl bg-[#0B1528] border ${item.border} hover:scale-[1.02] cursor-pointer transition-all space-y-2`}
                >
                  <span className="text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                    #{item.name}
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed mt-2">{item.desc}</p>
                  <p className="text-[10px] text-blue-400 font-semibold pt-1">Filter posts &rarr;</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 2. SETTINGS VIEW */}
        {activeTab === 'settings' && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                <SettingsIcon className="w-6 h-6 text-blue-500" />
                Platform Settings
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Manage your account credentials and feed personalization
              </p>
            </div>

            <div className="space-y-3">
              <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Account Email</h4>
                  <p className="text-[11px] text-slate-400">{currentUser?.email || 'Not logged in'}</p>
                </div>
                <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-xl border border-emerald-500/20 font-semibold">
                  Verified Member
                </span>
              </div>

              <div className="bg-[#0B1528] border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white">Theme Accent</h4>
                  <p className="text-[11px] text-slate-400">Default dark mode with cobalt accents</p>
                </div>
                <span className="text-[11px] text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-xl border border-blue-500/20 font-semibold">
                  Dark Active
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 3. HOME / TOP / BOOKMARKS FEED VIEW */}
        {activeTab !== 'categories' && activeTab !== 'settings' && (
          <>
            <div className="space-y-3">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  {activeTab === 'top' && <TrendingUp className="w-6 h-6 text-blue-500" />}
                  {activeTab === 'bookmarks' && <Bookmark className="w-6 h-6 text-blue-500" />}
                  {activeTab === 'top'
                    ? 'Top Discussions'
                    : activeTab === 'bookmarks'
                    ? 'Saved Bookmarks'
                    : 'Community Feed'}
                </h1>
                <p className="text-xs text-slate-400 mt-1">
                  {activeTab === 'top'
                    ? 'Opinions ranked by highest campus engagement and upvotes'
                    : activeTab === 'bookmarks'
                    ? 'Your private collection of saved opinions and references'
                    : 'Explore diverse perspectives from across our verified campus community'}
                </p>
              </div>

              {/* Category Filter Pills */}
              {activeTab === 'home' && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#0066FF] text-white shadow-lg shadow-blue-500/20'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12 text-slate-500 text-sm">Loading discussions...</div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8 space-y-2">
                <p className="text-slate-400 text-sm">
                  {activeTab === 'bookmarks'
                    ? 'You have not bookmarked any opinions yet.'
                    : 'No opinions found in this category.'}
                </p>
                {activeTab !== 'bookmarks' && (
                  <button
                    onClick={() => {
                      if (!currentUser) onOpenLogin();
                      else onOpenPostModal();
                    }}
                    className="text-xs text-blue-400 hover:underline font-semibold"
                  >
                    Be the first to publish an opinion!
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isBookmarked={savedPostIds.includes(post.id)}
                    onToggleBookmark={() => handleBookmarkToggle(post.id)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Widgets onCategoryClick={(cat) => setSelectedCategory(cat)} />
    </>
  );
}