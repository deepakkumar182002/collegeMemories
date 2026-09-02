import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Edit2, Trash2, Users, UploadCloud, Check, X } from 'lucide-react';
import { useFriends } from '../../hooks/useData';
import { friendsApi } from '../../api';
import { formatMediaUrl } from '../../lib/utils';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { Friend } from '../../types';
import { toast } from 'sonner';

export const AdminFriendsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: friends = [], isLoading } = useFriends(true);

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFriend, setEditingFriend] = useState<Friend | null>(null);

  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [funTitle, setFunTitle] = useState('');
  const [favoriteMemory, setFavoriteMemory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [batch, setBatch] = useState('Class of 2024');
  const [emoji, setEmoji] = useState('🎓');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openCreateModal = () => {
    setEditingFriend(null);
    setName('');
    setNickname('');
    setFunTitle('The Legend 😎');
    setFavoriteMemory('');
    setShortDescription('');
    setBatch('Class of 2024');
    setEmoji('🎓');
    setInstagram('');
    setLinkedin('');
    setGithub('');
    setProfileFile(null);
    setPreviewPhoto('');
    setModalOpen(true);
  };

  const openEditModal = (friend: Friend) => {
    setEditingFriend(friend);
    setName(friend.name || '');
    setNickname(friend.nickname || '');
    setFunTitle(friend.funTitle || '');
    setFavoriteMemory(friend.favoriteMemory || '');
    setShortDescription(friend.shortDescription || '');
    setBatch(friend.batch || 'Class of 2024');
    setEmoji(friend.emoji || '🎓');
    setInstagram(friend.socialLinks?.instagram || '');
    setLinkedin(friend.socialLinks?.linkedin || '');
    setGithub(friend.socialLinks?.github || '');
    setProfileFile(null);
    setPreviewPhoto(friend.profileImage ? formatMediaUrl(friend.profileImage) : '');
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('name', name.trim());
    formData.append('nickname', nickname.trim());
    formData.append('funTitle', funTitle.trim());
    formData.append('favoriteMemory', favoriteMemory.trim());
    formData.append('shortDescription', shortDescription.trim());
    formData.append('batch', batch.trim());
    formData.append('emoji', emoji);
    formData.append('socialLinks[instagram]', instagram.trim());
    formData.append('socialLinks[linkedin]', linkedin.trim());
    formData.append('socialLinks[github]', github.trim());

    if (profileFile) {
      formData.append('profileImage', profileFile);
    }

    try {
      if (editingFriend) {
        await friendsApi.update(editingFriend._id, formData);
        toast.success('Friend profile updated!');
      } else {
        await friendsApi.create(formData);
        toast.success('Batchmate ID added!');
      }
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save friend profile');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete profile for ${name}?`)) return;

    try {
      await friendsApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      toast.success('Profile deleted');
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading batch directory..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Batchmates & College ID Cards</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student ID cards with funny nicknames, honors, and favorite memories.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="bg-rose-900 hover:bg-rose-950 text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Batchmate ID
        </button>
      </div>

      {/* Friends Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {friends.map((friend) => {
          const photo = formatMediaUrl(friend.profileImage);

          return (
            <div
              key={friend._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-16 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                      {photo ? (
                        <img src={photo} alt={friend.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-lg text-rose-800">{friend.name.charAt(0)}</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-900">{friend.name}</h3>
                        <span>{friend.emoji || '🎓'}</span>
                      </div>
                      {friend.nickname && (
                        <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.5 rounded">
                          {friend.nickname}
                        </span>
                      )}
                      <p className="text-xs text-slate-500 mt-0.5 font-medium">{friend.funTitle}</p>
                    </div>
                  </div>
                </div>

                {friend.favoriteMemory && (
                  <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-handwriting text-base">
                    “{friend.favoriteMemory}”
                  </p>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">{friend.batch || 'Class of 2024'}</span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(friend)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-rose-900 hover:bg-slate-100"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(friend._id, friend.name)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editor Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h2 className="font-bold text-base text-slate-900">
                {editingFriend ? 'Edit Batchmate ID' : 'Add New Batchmate ID'}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Photo selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Profile Photograph
                </label>
                <div className="flex items-center gap-4">
                  {previewPhoto ? (
                    <img src={previewPhoto} alt="Preview" className="w-16 h-20 rounded-lg object-cover border" />
                  ) : (
                    <div className="w-16 h-20 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                      <Users className="w-6 h-6" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const f = e.target.files[0];
                        setProfileFile(f);
                        setPreviewPhoto(URL.createObjectURL(f));
                      }
                    }}
                    className="text-xs text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-900 hover:file:bg-rose-100 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rohan Verma"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Nickname (Emoji Included)
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="e.g. The Canteen Minister 🍔"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Funny Title / Batch Superlative
                </label>
                <input
                  type="text"
                  value={funTitle}
                  onChange={(e) => setFunTitle(e.target.value)}
                  placeholder="e.g. 75.01% Calculation Grandmaster"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                  Favorite College Memory Quote
                </label>
                <input
                  type="text"
                  value={favoriteMemory}
                  onChange={(e) => setFavoriteMemory(e.target.value)}
                  placeholder="e.g. Ordering 40 samosas for 5 people during midterms."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Batch / Major
                  </label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    placeholder="e.g. Computer Science 2024"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Sticker Emoji
                  </label>
                  <input
                    type="text"
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm text-center bg-slate-50/50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    Instagram URL
                  </label>
                  <input
                    type="text"
                    value={instagram}
                    onChange={(e) => setInstagram(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    LinkedIn URL
                  </label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs bg-slate-50/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                    GitHub URL
                  </label>
                  <input
                    type="text"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-2.5 py-1.5 rounded border border-slate-200 text-xs bg-slate-50/50"
                  />
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
                  {isSubmitting ? 'Saving...' : 'Save ID Card'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
