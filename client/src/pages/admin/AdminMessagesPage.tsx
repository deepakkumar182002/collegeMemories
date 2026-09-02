import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Edit2, Trash2, MessageSquare, Eye, EyeOff, Check, X } from 'lucide-react';
import { useMessages } from '../../hooks/useData';
import { messagesApi } from '../../api';
import { StickyNote } from '../../components/common/StickyNote';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Message } from '../../types';
import { toast } from 'sonner';

export const AdminMessagesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: messages = [], isLoading } = useMessages(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMsg, setEditingMsg] = useState<Message | null>(null);

  const [authorName, setAuthorName] = useState('');
  const [message, setMessage] = useState('');
  const [emoji, setEmoji] = useState('💌');
  const [style, setStyle] = useState<'yellow' | 'pink' | 'purple' | 'blue' | 'green' | 'orange'>('yellow');
  const [isPublished, setIsPublished] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingMsg(null);
    setAuthorName('');
    setMessage('');
    setEmoji('💌');
    setStyle('yellow');
    setIsPublished(true);
    setModalOpen(true);
  };

  const openEditModal = (msg: Message) => {
    setEditingMsg(msg);
    setAuthorName(msg.authorName || '');
    setMessage(msg.message || '');
    setEmoji(msg.emoji || '💌');
    setStyle(msg.style as any || 'yellow');
    setIsPublished(msg.isPublished !== undefined ? msg.isPublished : true);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const data = {
      authorName: authorName.trim(),
      message: message.trim(),
      emoji,
      style,
      isPublished,
    };

    try {
      if (editingMsg) {
        await messagesApi.update(editingMsg._id, data);
        toast.success('Note updated!');
      } else {
        await messagesApi.create(data);
        toast.success('New note added to wall!');
      }
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this message from the memory wall?')) return;

    try {
      await messagesApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success('Message deleted');
    } catch (err) {
      toast.error('Failed to delete message');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await messagesApi.update(id, { isPublished: !currentStatus });
      queryClient.invalidateQueries({ queryKey: ['messages'] });
      toast.success(currentStatus ? 'Note hidden' : 'Note visible on wall');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading memory wall moderation..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Memory Wall & Sticky Notes</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Moderate guestbook notes, inside jokes, and messages pinned by visitors.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-rose-900 hover:bg-rose-950 text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Pin Official Sticky Note
        </button>
      </div>

      {/* Grid of Sticky Notes with Moderation Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">{msg.authorName}</span>
                <span className="text-xl">{msg.emoji || '💌'}</span>
              </div>

              <div className="my-2">
                <StickyNote
                  content={msg.message}
                  author={msg.authorName}
                  emoji={msg.emoji}
                  style={msg.style}
                  rotation={0}
                  tapeTop={false}
                />
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <button
                onClick={() => handleTogglePublish(msg._id, msg.isPublished)}
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                  msg.isPublished
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}
              >
                {msg.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                {msg.isPublished ? 'Visible' : 'Hidden'}
              </button>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openEditModal(msg)}
                  className="p-1.5 rounded-lg text-slate-600 hover:text-rose-900 hover:bg-slate-100"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(msg._id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="font-bold text-base text-slate-900">
                {editingMsg ? 'Edit Sticky Note' : 'Pin Sticky Note'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Author Name *
                </label>
                <input
                  type="text"
                  required
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g. Maya R. (Batch of '24)"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Sticky Note Content *
                </label>
                <textarea
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50 resize-none font-handwriting text-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Sticker Emoji
                  </label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-base text-center bg-slate-50/50"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Note Color Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50"
                  >
                    <option value="yellow">Yellow</option>
                    <option value="pink">Pink</option>
                    <option value="purple">Purple</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-rose-900 hover:bg-rose-950 text-white px-5 py-2 rounded-lg font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  {isSubmitting ? 'Saving...' : 'Save Note'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
