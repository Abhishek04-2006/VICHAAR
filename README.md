# 💬 VICHAAR — Opinion Sharing Platform

> *"Different minds build a brighter tomorrow."* — VICHAAR Campus Community

**VICHAAR** is a modern full-stack web application designed for campus discourse and intellectual exchange. Built with a sleek dark aesthetic, it empowers users to publish perspectives, participate in threaded debates, upvote/downvote discussions in real time, and explore trending categories.

---

## ✨ Features

- **Dynamic Split-Screen Onboarding & Auth**:
  - Left showcase featuring an automated cross-fade carousel highlighting core platform features.
  - Right container powered by an infinite-loop background video paired with a floating glassmorphic authentication card.
  - Full support for JWT-based user authentication (Register & Sign In).
- **Protected Routing & Auth Gating**:
  - Route-level security redirecting unauthenticated users directly to the login portal before accessing feeds.
- **Dynamic Category Filtering**:
  - Filter opinions across dedicated categories: *Tech, Campus, Governance, Society, Economy*.
- **Community Feed & Real-Time Engagement**:
  - Dynamic relative timestamps (`Just now`, `5m ago`, `2h ago`, `3d ago`) synced with database creation timestamps.
  - Real-time client-side Upvote and Downvote toggling with optimistic UI updates.
  - Expandable nested comments and instant discussion reply threads.
- **Bookmarks & Top Discussions**:
  - 1-click post bookmarking with persistent client storage.
  - Dedicated "Top Discussions" tab sorting posts by campus engagement and upvote counts.
- **Responsive Layout & Widgets**:
  - Balanced 3-column desktop layout (Sidebar Navigation, Center Feed, Right Widgets).
  - Trending Categories shortcuts and interactive "Who to Follow" delegate suggestions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (via Vite)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM (`v6+`)
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL 8.0 (`vichaar_db`)
- **Security**: JSON Web Tokens (JWT), Bcrypt password hashing
- **CORS**: Configured for local development cross-origin requests

---

## 📁 Project Structure

```text
VICHAAR/
├── client/
│   ├── public/
│   │   ├── logo.png             # Modern geometric brand icon
│   │   ├── login-bg.mp4         # Looping background video
│   │   ├── slide1.png           # Carousel showcase slides
│   │   ├── slide2.png
│   │   ├── slide3.png
│   │   └── slide4.png
│   ├── src/
│   │   ├── api/                 # Axios configuration
│   │   ├── components/          # Navbar, Sidebar, Widgets, PostCard, CreatePostModal
│   │   ├── pages/               # Home, Login, Profile
│   │   ├── App.jsx              # Protected route wrappers
│   │   └── main.jsx             # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/                  # MySQL connection pool
│   ├── middleware/              # JWT verification middleware
│   ├── routes/                  # Express API route endpoints
│   ├── server.js                # Express app bootstrap
│   └── package.json
│
├── vichaar_db.sql               # MySQL database schema setup
└── README.md