import React, { useState } from 'react';
import { ArrowBigUp, ArrowBigDown, MessageCircle, Share2, MoreHorizontal, Bookmark, CheckCircle2, Award } from 'lucide-react';
import api from '../api';

const formatTimeAgo = (dateString) => {
  if (!dateString) return 'Just now';
  const diffInSeconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (isNaN(diffInSeconds) || diffInSeconds < 60) return 'Just now';
  const minutes = Math.floor(diffInSeconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

export default function PostCard({ post, isBookmarked = false, onToggleBookmark }) {
  const [upvotes, setUpvotes] = useState(post.upvotes || 0);
  const [downvotes, setDownvotes] = useState(post.downvotes || 0);
  const [userVote, setUserVote] = useState(post.user_vote || null);

  const handleVote = async (type) => {
    try {
      if (userVote === type) {
        setUserVote(null);
        if (type === 'UP') setUpvotes((v) => Math.max(0, v - 1));
        if (type === 'DOWN') setDownvotes((v) => Math.max(0, v - 1));
      } else {
        if (userVote === 'UP') setUpvotes((v) => Math.max(0, v - 1));
        if (userVote === 'DOWN') setDownvotes((v) => Math.max(0, v - 1));
        setUserVote(type);
        if (type === 'UP') setUpvotes((v) => v + 1);
        if (type === 'DOWN') setDownvotes((v) => v + 1);
      }
      await api.post(`/posts/${post.id}/vote`, { voteType: type });
    } catch (err) {
      console.error('Vote failed:', err);
    }
  };

  return (
    <article className="bg-[#111317] border border-[#1F2228] hover:border-[#2C3038] rounded-xl p-5 transition-all duration-200">
      {/* Header: Author & Credibility Meta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#181A20] border border-[#272B35] flex items-center justify-center font-bold text-xs text-[#E4E4E7] shrink-0">
            {post.author_name ? post.author_name.charAt(0).toUpperCase() : 'U'}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Author Name */}
            <span className="font-semibold text-[#F4F4F5] hover:underline cursor-pointer">
                {post.author_name || 'Anonymous'}
               </span>
                {/* Real Earned Badges Only - No Dummy/Fallback */}
            {post.author_badge === 'VERIFIED_DEBATER' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/25">
           <Award className="w-3 h-3 stroke-[2.2]" />
            Top Debater
          </span>
        )}
            
            {post.author_badge === 'DELEGATE' && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
           <CheckCircle2 className="w-3 h-3 stroke-[2.2]" />
             Delegate
          </span>
        )}

          {/* User ka actual Department (agar profile me added ho) */}
          {post.author_department && (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181A20] text-[#8E929E] border border-[#272B35]">
          {post.author_department}
        </span>
          )}
            <span className="text-[#52525B]">•</span>
            <span className="text-[#71717A] text-[11px]">{formatTimeAgo(post.created_at)}</span>

            {/* Post Category */}
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#181A20] text-[#A1A1AA] border border-[#262931]">
              {post.category || 'General'}
            </span>
          </div>
        </div>

        <button className="text-[#71717A] hover:text-[#D4D4D8] p-1">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      {/* Main Content */}
      <div className="space-y-1.5 cursor-pointer">
        <h2 className="text-[15px] font-semibold text-[#F4F4F5] leading-snug tracking-tight hover:text-blue-400 transition-colors">
          {post.title}
        </h2>
        <p className="text-[13px] text-[#A1A1AA] leading-relaxed line-clamp-3">
          {post.content}
        </p>
      </div>

      {/* Modern Interaction Bar */}
      <div className="flex items-center justify-between pt-3.5 mt-3.5 border-t border-[#1A1C22]">
        <div className="flex items-center gap-1.5">
          {/* Vote Cluster */}
          <div className="flex items-center bg-[#181A20] border border-[#262931] rounded-lg p-0.5">
            <button
              onClick={() => handleVote('UP')}
              className={`p-1 rounded flex items-center gap-1 text-xs transition-colors ${
                userVote === 'UP' ? 'text-emerald-400 bg-emerald-500/10' : 'text-[#71717A] hover:text-[#F4F4F5]'
              }`}
            >
              <ArrowBigUp className={`w-4 h-4 ${userVote === 'UP' ? 'fill-current' : ''}`} />
              <span className="font-mono text-[11px] pr-1">{upvotes}</span>
            </button>
            <span className="w-px h-3 bg-[#262931]"></span>
            <button
              onClick={() => handleVote('DOWN')}
              className={`p-1 rounded text-xs transition-colors ${
                userVote === 'DOWN' ? 'text-rose-400 bg-rose-500/10' : 'text-[#71717A] hover:text-[#F4F4F5]'
              }`}
            >
              <ArrowBigDown className={`w-4 h-4 ${userVote === 'DOWN' ? 'fill-current' : ''}`} />
            </button>
          </div>

          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-[#71717A] hover:text-[#E4E4E7] hover:bg-[#181A20] transition-colors">
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{post.comment_count || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-md transition-colors ${
              isBookmarked ? 'text-blue-400 bg-blue-500/10' : 'text-[#71717A] hover:text-[#F4F4F5]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>
          <button className="text-[#71717A] hover:text-[#F4F4F5] p-1.5 rounded-md">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}