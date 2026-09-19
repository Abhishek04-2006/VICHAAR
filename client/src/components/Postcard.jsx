import React, { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, MoreVertical, Send} from 'lucide-react';
import api from '../api';

export default function PostCard({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const [userVote, setUserVote] = useState(post.user_vote || null); // 'UP', 'DOWN', or null
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [commentCount, setCommentCount] = useState(post.comment_count || 0);
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  const handleVote = async (type) => {
    try {
      // Optimistic client update
      if (userVote === type) {
        // Untoggle
        setUserVote(null);
        if (type === 'UP') setUpvotes((v) => Math.max(0, v - 1));
        if (type === 'DOWN') setDownvotes((v) => Math.max(0, v - 1));
      } else {
        // Toggle or switch
        if (userVote === 'UP') setUpvotes((v) => Math.max(0, v - 1));
        if (userVote === 'DOWN') setDownvotes((v) => Math.max(0, v - 1));

        setUserVote(type);
        if (type === 'UP') setUpvotes((v) => v + 1);
        if (type === 'DOWN') setDownvotes((v) => v + 1);
      }

      await api.post(`/posts/${post.id}/vote`, { voteType: type });
    } catch (err) {
      console.error('Voting failed:', err);
    }
  };
       const toggleComments = async () => {
    const nextState = !showComments;
    setShowComments(nextState);

    if (nextState && comments.length === 0) {
      try {
        setLoadingComments(true);
        const res = await api.get(`/posts/${post.id}/comments`);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error('Failed to load comments:', err);
      } finally {
        setLoadingComments(false);
      }
    }
  };

         const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: newComment });
      if (res.data.comment) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentCount((prev) => prev + 1);
        setNewComment('');
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Please sign in to comment.');
    } finally {
      setSubmittingComment(false);
    }
  };
  return (
    <article className="bg-[#0B1528] border border-slate-800 rounded-2xl p-6 hover:border-slate-700 transition-colors space-y-4">
      {/* Author Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-semibold text-white">
            {post.author_name ? post.author_name.charAt(0) : 'U'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">
                {post.author_name || 'Anonymous Contributor'}
              </span>
              <span className="text-xs text-slate-500">• {post.time_ago || 'Just now'}</span>
            </div>
            <span className="inline-block mt-0.5 px-2 py-0.5 text-[11px] font-medium rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {post.category || 'General'}
            </span>
          </div>
        </div>
        <button className="text-slate-500 hover:text-slate-300">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Post Content */}
      <div className="space-y-1.5">
        <h2 className="text-lg font-bold text-white hover:text-blue-400 transition-colors cursor-pointer">
          {post.title}
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed line-clamp-3">
          {post.content}
        </p>
      </div>

      {/* Engagement Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-2">
          {/* Upvote */}
          <button
            onClick={() => handleVote('UP')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              userVote === 'UP'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-emerald-400'
            }`}
          >
            <ArrowBigUp className={`w-4 h-4 ${userVote === 'UP' ? 'fill-current' : ''}`} />
            <span>{upvotes}</span>
          </button>

          {/* Downvote */}
          <button
            onClick={() => handleVote('DOWN')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              userVote === 'DOWN'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                : 'bg-slate-800/50 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-rose-400'
            }`}
          >
            <ArrowBigDown className={`w-4 h-4 ${userVote === 'DOWN' ? 'fill-current' : ''}`} />
            <span>{downvotes}</span>
          </button>

           {/* Comment Count / Trigger */}
          <button
            onClick={toggleComments}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              showComments 
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/40' 
                : 'bg-slate-800/40 text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{commentCount}</span>
          </button>
        </div>

        <button className="text-slate-400 hover:text-white transition-colors p-1.5">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Expanded Comments Thread */}
      {showComments && (
        <div className="pt-4 border-t border-slate-800/80 space-y-4">
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              placeholder="Join the discussion..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-[#030F26] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-blue-500 placeholder:text-slate-600"
            />
            <button
              type="submit"
              disabled={submittingComment}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{submittingComment ? '...' : 'Reply'}</span>
            </button>
          </form>

          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {loadingComments ? (
              <p className="text-xs text-slate-500">Loading replies...</p>
            ) : comments.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No comments yet. Start the conversation!</p>
            ) : (
              comments.map((c) => (
                <div key={c.id} className="bg-[#030F26]/70 border border-slate-800/60 rounded-xl p-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-semibold text-slate-300">{c.author_name}</span>
                    <span>{new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-xs text-slate-300">{c.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </article>
  );
}