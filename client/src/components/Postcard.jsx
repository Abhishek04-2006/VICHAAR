import React, { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, MoreVertical } from 'lucide-react';
import api from '../api';

export default function PostCard({ post }) {
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const [userVote, setUserVote] = useState(post.user_vote || null); // 'UP', 'DOWN', or null

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

          {/* Comment Count */}
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-400 bg-slate-800/40">
            <MessageCircle className="w-4 h-4" />
            <span>{post.comment_count || 0}</span>
          </div>
        </div>

        <button className="text-slate-400 hover:text-white transition-colors p-1.5">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  );
}