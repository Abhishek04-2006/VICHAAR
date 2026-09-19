import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Widgets from './components/Widgets';
import PostCard from './components/Postcard';
import CreatePostModal from './components/CreatePostModal';
import LoginModal from './components/LoginModal';
import api from './api';

const CATEGORIES = ['All', 'Tech', 'Campus', 'Governance', 'Society', 'Economy'];

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
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

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  // Client-side search filtering across title and content
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans">
      <Navbar
        currentUser={currentUser}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        onLogout={() => {
          localStorage.clear();
          setCurrentUser(null);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <div className="max-w-7xl mx-auto px-4 w-full flex gap-8 pt-6 flex-1">
        {/* Left Sidebar */}
        <Sidebar
          currentUser={currentUser}
          onOpenPostModal={() => {
            if (!currentUser) setIsLoginModalOpen(true);
            else setIsPostModalOpen(true);
          }}
        />

        {/* Center Feed */}
        <main className="flex-1 max-w-2xl space-y-6 pb-12">
          <div className="space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Top Discussions</h1>
              <p className="text-xs text-slate-400 mt-1">
                Explore diverse perspectives from across our verified campus community
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
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
          </div>

          {/* Posts Feed */}
          {loading ? (
            <div className="text-center py-12 text-slate-500 text-sm">Loading discussions...</div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8 space-y-2">
              <p className="text-slate-400 text-sm">No opinions found in this category.</p>
              <button
                onClick={() => {
                  if (!currentUser) setIsLoginModalOpen(true);
                  else setIsPostModalOpen(true);
                }}
                className="text-xs text-blue-400 hover:underline font-semibold"
              >
                Be the first to publish an opinion!
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar Widgets */}
        <Widgets onCategoryClick={(cat) => setSelectedCategory(cat)} />
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={(user) => setCurrentUser(user)}
      />
    </div>
  );
}