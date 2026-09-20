import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import ProfilePage from './pages/Profile';
import CreatePostModal from './components/CreatePostModal';
import api from './api';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

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
    if (currentUser) {
      fetchPosts(selectedCategory);
    }
  }, [selectedCategory, currentUser]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans">
      {/* Navbar tabhi dikhega jab user login ho chuka ho */}
      {currentUser && (
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <div className={`w-full flex-1 ${currentUser ? 'max-w-7xl mx-auto px-4 flex gap-8 pt-6' : ''}`}>
        {/* Left Sidebar bhi sirf login ke baad dikhega */}
        {currentUser && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'home') navigate('/');
              else if (tab === 'profile') navigate('/profile');
            }}
            currentUser={currentUser}
            onOpenLogin={() => navigate('/login')}
            onOpenPostModal={() => setIsPostModalOpen(true)}
          />
        )}

        {/* Protected Routing Flow */}
        <Routes>
          {/* 1. Login Page */}
          <Route
            path="/login"
            element={
              currentUser ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage
                  onLoginSuccess={(user) => {
                    setCurrentUser(user);
                    navigate('/');
                  }}
                />
              )
            }
          />

          {/* 2. Home Page (Protected) */}
          <Route
            path="/"
            element={
              currentUser ? (
                <HomePage
                  posts={posts}
                  loading={loading}
                  currentUser={currentUser}
                  searchQuery={searchQuery}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  activeTab={activeTab}
                  onOpenPostModal={() => setIsPostModalOpen(true)}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* 3. Profile Page (Protected) */}
          <Route
            path="/profile"
            element={
              currentUser ? (
                <ProfilePage currentUser={currentUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Fallback to login if not authenticated */}
          <Route
            path="*"
            element={<Navigate to={currentUser ? "/" : "/login"} replace />}
          />
        </Routes>
      </div>

      <CreatePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}