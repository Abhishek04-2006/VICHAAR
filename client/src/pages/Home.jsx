import React, { useState, useEffect } from 'react';
import Widgets from '../components/Widgets';
import PostCard from '../components/Postcard';
import CreatePostModal from '../components/CreatePostModal';
import api from '../api';

const CATEGORIES = ['All', 'Tech', 'Campus', 'Governance', 'Society', 'Economy'];

export default function HomePage({ currentUser, onOpenLogin, searchQuery, selectedCategory, setSelectedCategory }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

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

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title?.toLowerCase().includes((searchQuery || '').toLowerCase()) ||
      post.content?.toLowerCase().includes((searchQuery || '').toLowerCase());
    return matchesSearch;
  });

  return (
    <>
      <main className="flex-1 max-w-2xl space-y-6 pb-12">
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Top Discussions</h1>
            <p className="text-xs text-slate-400 mt-1">
              Explore diverse perspectives from across our verified campus community
            </p>
          </div>

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
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-500 text-sm">Loading discussions...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-2xl p-8 space-y-2">
            <p className="text-slate-400 text-sm">No opinions found in this category.</p>
            <button
              onClick={() => {
                if (!currentUser) onOpenLogin();
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

      <Widgets onCategoryClick={(cat) => setSelectedCategory(cat)} />

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </>
  );
}