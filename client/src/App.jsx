import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// API instance
import api from './api';

// Components
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CreatePostModal from './components/CreatePostModal';

// Pages
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import ProfilePage from './pages/Profile';
import useDebounce from './hooks/useDebounce';
import CategoriesPage from './pages/Categories';

export default function App() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const debouncedSearch = useDebounce(searchQuery, 350);

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const navigate = useNavigate();

  // Sync latest user details (including avatar) from DB on load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.get('/auth/me')
        .then((res) => {
          setCurrentUser(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setCurrentUser(null);
        });
    }
  }, []);

  const fetchPosts = async (cat = selectedCategory, search = debouncedSearch) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (cat && cat !== 'All') params.append('category', cat);
      if (search && search.trim()) params.append('search', search.trim());

      const res = await api.get(`/posts?${params.toString()}`);
      setPosts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Jab bhi category ya debounced search badle, fetch execute ho
  useEffect(() => {
    if (currentUser) {
      fetchPosts(selectedCategory, debouncedSearch);
    }
  }, [selectedCategory, debouncedSearch, currentUser?.id]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleUserUpdate = (updatedUserData) => {
    setCurrentUser(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#090A0D] text-[#EDEDED] flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar */}
      {currentUser && (
        <Navbar
          currentUser={currentUser}
          onLogout={handleLogout}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      )}

      <div className={`w-full flex-1 ${currentUser ? 'max-w-7xl mx-auto px-4 sm:px-6 flex gap-8 pt-6' : ''}`}>
        {/* Left Sidebar */}
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

          {/* 2. Home Page */}
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

          {/* 3. Profile Page (with onUserUpdate callback) */}
          <Route
            path="/profile"
            element={
              currentUser ? (
                <ProfilePage
                  currentUser={currentUser}
                  onUserUpdate={handleUserUpdate}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Fallback */}
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