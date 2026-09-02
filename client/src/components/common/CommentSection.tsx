import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, MessageSquare, Sparkles, User, Clock, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useComments, useAddCommentMutation, useDeleteCommentMutation } from '../../hooks/useData';
import { useAuth } from '../../context/AuthContext';
import { AlumniComment } from '../../types';

const AVATAR_OPTIONS = ['🎓', '📸', '🎒', '☕', '🎨', '🎸', '🌟', '🍕', '🥳', '😎'];

const STICKY_BG_COLORS = [
  'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/50',
  'bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/50',
  'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50',
  'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/50',
  'bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-900/50',
];

interface CommentSectionProps {
  targetType: 'chapter' | 'memory';
  targetId: string;
  targetTitle?: string;
  className?: string;
  defaultExpanded?: boolean;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  targetType,
  targetId,
  targetTitle = 'Chapter',
  className = '',
  defaultExpanded = false,
}) => {
  const { data: comments = [], isLoading } = useComments(targetType, targetId);
  const addCommentMutation = useAddCommentMutation();
  const deleteCommentMutation = useDeleteCommentMutation();
  const { isAuthenticated } = useAuth();

  // Collapsible Dropdown State (DEFAULT CLOSED as requested)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const [authorName, setAuthorName] = useState(() => localStorage.getItem('alumni_comment_name') || '');
  const [selectedAvatar, setSelectedAvatar] = useState('🎓');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    const finalAuthor = authorName.trim() || 'Alumni Friend';
    localStorage.setItem('alumni_comment_name', finalAuthor);

    addCommentMutation.mutate(
      {
        targetType,
        targetId,
        authorName: finalAuthor,
        authorAvatar: selectedAvatar,
        content: content.trim(),
      },
      {
        onSettled: () => {
          setIsSubmitting(false);
          setContent('');
        },
      }
    );
  };

  const handleDelete = (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      deleteCommentMutation.mutate(commentId);
    }
  };

  return (
    <div className={`pt-3 ${className}`}>
      {/* Collapsible Accordion Dropdown Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white/80 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/90 border border-slate-200/90 dark:border-slate-800 shadow-xs transition-all text-left group"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-400 flex items-center justify-center shadow-xs">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-headline text-sm md:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span>Memory Notes & Inside Jokes</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-montserrat font-bold bg-rose-50 dark:bg-rose-950 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                {comments.length}
              </span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {isExpanded ? 'Click to collapse notes' : 'Click to read & pin memory notes'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-handwriting text-slate-500 dark:text-slate-400 text-base hidden sm:inline">
            Leave a footprint 🐾
          </span>
          <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-rose-100 dark:group-hover:bg-rose-950 text-slate-600 dark:text-slate-300 transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Expandable Content Body */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden space-y-6 pt-4"
          >
            {/* Comment Form */}
            <form
              onSubmit={handleSubmit}
              className="p-4 md:p-5 rounded-2xl bg-slate-50/90 dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800 space-y-4 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Author Name */}
                <div className="flex-1">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Your Name / Nickname
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul (Class of '24)"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                    maxLength={50}
                  />
                </div>

                {/* Avatar Emoji Picker */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Pick Student Avatar
                  </label>
                  <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 overflow-x-auto max-w-[260px]">
                    {AVATAR_OPTIONS.map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        onClick={() => setSelectedAvatar(emoji)}
                        className={`p-1 text-sm rounded-lg transition-transform ${
                          selectedAvatar === emoji
                            ? 'bg-rose-100 dark:bg-rose-950/60 scale-125 border border-rose-300 dark:border-rose-700'
                            : 'hover:scale-110 opacity-70 hover:opacity-100'
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment Message Input */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Memory Note / Comment *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Share a nostalgic memory, canteen story, funny quote or wish..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-rose-500/30 font-body resize-none"
                  maxLength={1000}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-slate-400 dark:text-slate-500">
                  Email alert sent to admin on submit ✉️
                </span>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={isSubmitting || !content.trim()}
                  className="bg-rose-900 hover:bg-rose-950 dark:bg-rose-700 dark:hover:bg-rose-800 disabled:opacity-50 text-white px-5 py-2 rounded-xl font-montserrat text-xs font-bold uppercase tracking-wider shadow-sm flex items-center gap-1.5 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  {isSubmitting ? 'Posting...' : 'Pin Memory Note'}
                </motion.button>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-1">
              {isLoading ? (
                <div className="py-6 text-center text-xs text-slate-400">Loading nostalgic notes...</div>
              ) : comments.length === 0 ? (
                <div className="py-8 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
                  <span className="text-3xl block mb-2">💌</span>
                  <p className="font-handwriting text-xl text-slate-600 dark:text-slate-400">
                    No notes yet! Be the first classmate to pin a memory note here.
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {comments.map((comment: AlumniComment, idx: number) => {
                    const bgClass = STICKY_BG_COLORS[idx % STICKY_BG_COLORS.length];
                    const dateStr = new Date(comment.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    });

                    return (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`p-4 rounded-xl border ${bgClass} shadow-xs relative group transition-all`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xl select-none">{comment.authorAvatar || '🎓'}</span>
                            <div>
                              <span className="font-montserrat text-xs font-bold text-slate-900 dark:text-slate-100">
                                {comment.authorName}
                              </span>
                              <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                                <Clock className="w-3 h-3" />
                                <span>{dateStr}</span>
                              </div>
                            </div>
                          </div>

                          {isAuthenticated && (
                            <button
                              onClick={() => handleDelete(comment._id)}
                              className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-700 p-1 rounded transition-opacity"
                              title="Delete comment (Admin)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <p className="font-body text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                          {comment.content}
                        </p>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

