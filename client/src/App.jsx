import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import PostCard from './components/Postcard';
import Widgets from './components/Widgets';
import CreatePostModal from './components/CreatePostModal';
import LoginModal from './components/LoginModal';
import api from './api';

const CATEGORY_PILLS = ['All', 'Tech', 'Campus', 'Governance', 'Society', 'Economy'];

export default function App() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data.posts || res.data || []);
      } catch (err) {
        console.warn('Backend offline or empty; rendering mock cards.', err);
        // Fallback demo posts if backend isn't returning data yet
        setPosts([
          {
            id: 1,
            author_name: 'Aarav Singh',
            time_ago: '2h ago',
            category: 'Tech',
            title: 'The Future of Artificial Intelligence in India',
            content: 'AI is changing the way we live and work. From education to healthcare, India has a unique opportunity to lead in ethical AI deployment.',
            upvotes: 128,
            downvotes: 12,
            comment_count: 24,
          },
          {
            id: 2,
            author_name: 'Diya Sharma',
            time_ago: '4h ago',
            category: 'Campus',
            title: 'Should College Attendance be Mandatory?',
            content: 'Mandatory 75% attendance policies often enforce physical presence rather than active conceptual learning. Discussion is needed on adaptive hybrid learning.',
            upvotes: 96,
            downvotes: 18,
            comment_count: 32,
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeed();
  }, []);

  return (
    <div className="min-h-screen bg-[#030F26] text-slate-100 flex flex-col font-sans">
      <Navbar />

      <main className="max-w-7xl w-full mx-auto px-6 flex-1 flex gap-8">
        {/* Left Column */}
        <Sidebar 
         onOpenCreateModal={() => {
        const token = localStorage.getItem('token');
          if (!token) {
         setIsLoginOpen(true);
        } else {
      setIsModalOpen(true);
    }
  }} 
      />

        {/* Center Feed */}
        <section className="flex-1 py-6 space-y-6 max-w-2xl">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Top Discussions
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Explore diverse perspectives from across our verified campus community
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORY_PILLS.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'bg-[#0B1528] text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {loading ? (
              <p className="text-sm text-slate-400">Loading feed...</p>
            ) : (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </section>

        {/* Right Column */}
        <Widgets />
      </main>
      <CreatePostModal
       isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onPostCreated={(newPost) => setPosts([newPost, ...posts])}
         />
         <LoginModal 
           isOpen={isLoginOpen} 
           onClose={() => setIsLoginOpen(false)} 
           onLoginSuccess={() => setIsModalOpen(true)}
       />
     </div>
  );
}