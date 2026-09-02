import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Search, Edit2, Trash2, Star, Eye, EyeOff, Filter, Film, Image as ImageIcon } from 'lucide-react';
import { useMemories, useChapters } from '../../hooks/useData';
import { memoriesApi } from '../../api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatMediaUrl } from '../../lib/utils';
import { toast } from 'sonner';

export const AdminMemoriesPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: chapters = [] } = useChapters(true);
  const { data: memoriesData, isLoading } = useMemories({
    includeUnpublished: true,
    chapter: selectedChapter || undefined,
    mediaType: selectedMediaType !== 'all' ? selectedMediaType : undefined,
    search: searchQuery || undefined,
  });

  const memories = memoriesData?.memories || [];

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete memory: "${title}"?`)) return;

    try {
      await memoriesApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast.success('Memory deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete memory');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const formData = new FormData();
      formData.append('isPublished', String(!currentStatus));
      await memoriesApi.update(id, formData);
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast.success(currentStatus ? 'Memory unpublished' : 'Memory published!');
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const formData = new FormData();
      formData.append('isFeatured', String(!currentStatus));
      await memoriesApi.update(id, formData);
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      toast.success(currentStatus ? 'Removed from featured' : 'Marked as featured!');
    } catch (err: any) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading memories manager..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Memory Management</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, edit, organize, and publish college memories and media.
          </p>
        </div>

        <Link
          to="/admin/memories/create"
          className="bg-rose-900 hover:bg-rose-950 text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create New Memory
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search memories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-rose-800 bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto flex-wrap">
          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-rose-800"
          >
            <option value="">All Chapters</option>
            {chapters.map((ch) => (
              <option key={ch._id} value={ch._id}>
                Chapter {ch.chapterNumber}: {ch.title}
              </option>
            ))}
          </select>

          <select
            value={selectedMediaType}
            onChange={(e) => setSelectedMediaType(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-rose-800"
          >
            <option value="all">All Media</option>
            <option value="image">Photos</option>
            <option value="video">Videos</option>
            <option value="text">Notes</option>
          </select>
        </div>
      </div>

      {/* Memories Table / Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3.5 pl-5">Preview</th>
                <th className="p-3.5">Title & Caption</th>
                <th className="p-3.5">Chapter</th>
                <th className="p-3.5">Style</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {memories.map((mem) => {
                const thumb = formatMediaUrl(mem.media?.thumbnail || mem.media?.url);
                const chapterTitle = typeof mem.chapter === 'object' ? mem.chapter?.title : 'Chapter';

                return (
                  <tr key={mem._id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 pl-5">
                      <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center">
                        {thumb ? (
                          <img src={thumb} alt={mem.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">{mem.emoji || '📸'}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5">
                      <div className="font-semibold text-slate-900">{mem.title}</div>
                      {mem.caption && <div className="text-slate-400 text-[11px] truncate max-w-xs font-handwriting text-base">“{mem.caption}”</div>}
                      <div className="text-slate-400 text-[10px]">{mem.memoryDate || mem.year}</div>
                    </td>

                    <td className="p-3.5">
                      <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {chapterTitle}
                      </span>
                    </td>

                    <td className="p-3.5 uppercase text-[10px] font-bold text-slate-500">
                      {mem.layoutStyle}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePublish(mem._id, mem.isPublished)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors flex items-center gap-1 ${
                            mem.isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {mem.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                          {mem.isPublished ? 'Published' : 'Draft'}
                        </button>

                        <button
                          onClick={() => handleToggleFeatured(mem._id, mem.isFeatured)}
                          className={`p-1 rounded-md transition-colors ${
                            mem.isFeatured
                              ? 'text-amber-600 bg-amber-50'
                              : 'text-slate-300 hover:text-slate-500'
                          }`}
                          title={mem.isFeatured ? 'Featured Memory' : 'Mark as Featured'}
                        >
                          <Star className={`w-3.5 h-3.5 ${mem.isFeatured ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/admin/memories/${mem._id}/edit`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-rose-900 hover:bg-slate-100 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(mem._id, mem.title)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
