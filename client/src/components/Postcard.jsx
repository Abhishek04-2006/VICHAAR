import React, { useState, useEffect } from 'react';
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageCircle, 
  Share2, 
  MoreHorizontal, 
  Bookmark, 
  CheckCircle2, 
  Award,
  Send,
  CornerDownRight
} from 'lucide-react';
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

export default function PostCard({ post, currentUser, isBookmarked = false, onToggleBookmark }) {
  // Voting states
  const [upvotes, setUpvotes] = useState(Number(post.upvotes) || 0);
  const [downvotes, setDownvotes] = useState(Number(post.downvotes) || 0);
  const [userVote, setUserVote] = useState(post.user_vote || null);
  const [isVoting, setIsVoting] = useState(false);

  // Comment section states
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(Number(post.comment_count) || 0);
  const [commentText, setCommentText] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Sync state whenever post prop changes
  useEffect(() => {
    setUpvotes(Number(post.upvotes) || 0);
    setDownvotes(Number(post.downvotes) || 0);
    setUserVote(post.user_vote || null);
    setCommentCount(Number(post.comment_count) || 0);
  }, [post.id, post.upvotes, post.downvotes, post.user_vote, post.comment_count]);

  // Handle Voting
  const handleVote = async (type) => {
    if (isVoting) return;

    const prevVote = userVote;
    const prevUp = upvotes;
    const prevDown = downvotes;

    let nextVote = prevVote === type ? null : type;
    let nextUp = prevUp;
    let nextDown = prevDown;

    if (prevVote === 'UP') nextUp = Math.max(0, nextUp - 1);
    if (prevVote === 'DOWN') nextDown = Math.max(0, nextDown - 1);

    if (nextVote === 'UP') nextUp += 1;
    if (nextVote === 'DOWN') nextDown += 1;

    // Optimistic UI update
    setUserVote(nextVote);
    setUpvotes(nextUp);
    setDownvotes(nextDown);
    setIsVoting(true);

    try {
      const res = await api.post(`/posts/${post.id}/vote`, { voteType: type });
      if (res.data) {
        if (res.data.upvotes !== undefined) setUpvotes(Number(res.data.upvotes));
        if (res.data.downvotes !== undefined) setDownvotes(Number(res.data.downvotes));
        if (res.data.user_vote !== undefined) setUserVote(res.data.user_vote);
      }
    } catch (err) {
      console.error('Vote failed, rolling back:', err);
      setUserVote(prevVote);
      setUpvotes(prevUp);
      setDownvotes(prevDown);
    } finally {
      setIsVoting(false);
    }
  };

  // Toggle & Fetch Comments
  const toggleComments = async () => {
    if (!showComments && comments.length === 0) {
      fetchComments();
    }
    setShowComments((prev) => !prev);
  };

  const fetchComments = async () => {
    try {
      setLoadingComments(true);
      const res = await api.get(`/posts/${post.id}/comments`);
      setComments(res.data.comments || []);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoadingComments(false);
    }
  };

  // Submit New Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || submittingComment) return;

    try {
      setSubmittingComment(true);
      const res = await api.post(`/posts/${post.id}/comments`, { content: commentText.trim() });
      if (res.data && res.data.comment) {
        setComments((prev) => [...prev, res.data.comment]);
        setCommentCount((c) => c + 1);
        setCommentText('');
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <article className="bg-[#111317] border border-[#1F2228] hover:border-[#2C3038] rounded-xl p-5 transition-all duration-200">
      {/* Header: Author & Credibility Meta */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#181A20] border border-[#272B35] flex items-center justify-center font-bold text-xs text-[#E4E4E7] shrink-0 overflow-hidden">
            {post.author_avatar ? (
              <img src={post.author_avatar} alt={post.author_name} className="w-full h-full object-cover" />
            ) : (
              post.author_name ? post.author_name.charAt(0).toUpperCase() : 'U'
            )}
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-[#F4F4F5] hover:underline cursor-pointer">
              {post.author_name || 'Anonymous'}
            </span>

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

            {post.author_department && (
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#181A20] text-[#8E929E] border border-[#272B35]">
                {post.author_department}
              </span>
            )}

            <span className="text-[#52525B]">•</span>
            <span className="text-[#71717A] text-[11px]">{formatTimeAgo(post.created_at)}</span>

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
              disabled={isVoting}
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
              disabled={isVoting}
              className={`p-1 rounded text-xs transition-colors ${
                userVote === 'DOWN' ? 'text-rose-400 bg-rose-500/10' : 'text-[#71717A] hover:text-[#F4F4F5]'
              }`}
            >
              <ArrowBigDown className={`w-4 h-4 ${userVote === 'DOWN' ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Comment Trigger Button */}
          <button 
            onClick={toggleComments}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
              showComments ? 'text-blue-400 bg-blue-500/10' : 'text-[#71717A] hover:text-[#E4E4E7] hover:bg-[#181A20]'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span className="font-mono text-[11px]">{commentCount}</span>
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

      {/* Integrated Comments Expansion Drawer */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-[#1F2228] space-y-3.5">
          {/* Add Comment Input Form */}
          <form onSubmit={handleAddComment} className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Contribute your thought to this discourse..."
              className="flex-1 bg-[#181A20] border border-[#262931] focus:border-blue-500/50 rounded-xl px-3.5 py-2 text-xs text-[#EDEDED] placeholder-[#71717A] outline-none transition-colors"
            />
            <button
              type="submit"
              disabled={submittingComment || !commentText.trim()}
              className="px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-medium flex items-center justify-center transition-all cursor-pointer active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comments List */}
          {loadingComments ? (
            <div className="py-3 text-center text-xs text-[#71717A] font-mono">
              Loading thoughts...
            </div>
          ) : comments.length === 0 ? (
            <div className="py-3 text-center text-xs text-[#71717A] font-mono">
              No responses yet. Be the first to deliberate!
            </div>
          ) : (
            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
              {comments.map((c) => (
                <div key={c.id} className="bg-[#14161C] border border-[#1D2027] rounded-xl p-3 flex gap-2.5 items-start">
                  <div className="w-6 h-6 rounded-full bg-[#181A20] border border-[#272B35] flex items-center justify-center text-[10px] font-bold text-[#E4E4E7] shrink-0 overflow-hidden mt-0.5">
                    {c.author_avatar ? (
                      <img src={c.author_avatar} alt={c.author_name} className="w-full h-full object-cover" />
                    ) : (
                      c.author_name ? c.author_name.charAt(0).toUpperCase() : 'U'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#F4F4F5]">
                        {c.author_name}
                      </span>
                      <span className="text-[10px] text-[#71717A] font-mono">
                        {formatTimeAgo(c.created_at)}
                      </span>
                    </div>
                    <p className="text-xs text-[#D4D4D8] mt-1 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </article>
  );
}