import React from 'react';
import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Edit2, Trash2, Eye, EyeOff, BookOpen, ArrowUpDown } from 'lucide-react';
import { useChapters } from '../../hooks/useData';
import { chaptersApi } from '../../api';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatMediaUrl } from '../../lib/utils';
import { toast } from 'sonner';

export const AdminChaptersPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: chapters = [], isLoading } = useChapters(true);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete chapter: "${title}"? Associated memories will also be deleted.`)) return;

    try {
      await chaptersApi.delete(id);
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success('Chapter deleted successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete chapter');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const formData = new FormData();
      formData.append('isPublished', String(!currentStatus));
      await chaptersApi.update(id, formData);
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      toast.success(currentStatus ? 'Chapter unpublished' : 'Chapter published');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading chapter manager..." />;
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Story Chapters</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize the 13 timeline chapters representing each milestone of college life.
          </p>
        </div>

        <Link
          to="/admin/chapters/create"
          className="bg-rose-900 hover:bg-rose-950 text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center justify-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Add Story Chapter
        </Link>
      </div>

      {/* Chapters List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-slate-100">
          {chapters.map((ch) => {
            const cover = formatMediaUrl(ch.coverImage);

            return (
              <div
                key={ch._id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {cover ? (
                      <img src={cover} alt={ch.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl">{ch.emoji || '📖'}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded">
                        Chapter {ch.chapterNumber < 10 ? `0${ch.chapterNumber}` : ch.chapterNumber}
                      </span>
                      {ch.year && <span className="text-xs font-medium text-slate-400">{ch.year}</span>}
                    </div>

                    <h3 className="font-bold text-base text-slate-900 truncate flex items-center gap-2">
                      {ch.title}
                      {ch.emoji && <span>{ch.emoji}</span>}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 max-w-xl">
                      {ch.shortDescription || ch.fullDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => handleTogglePublish(ch._id, ch.isPublished)}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                      ch.isPublished
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {ch.isPublished ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    {ch.isPublished ? 'Published' : 'Draft'}
                  </button>

                  <Link
                    to={`/admin/chapters/${ch._id}/edit`}
                    className="p-2 rounded-lg text-slate-600 hover:text-rose-900 hover:bg-slate-100 transition-colors"
                    title="Edit Chapter"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(ch._id, ch.title)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Delete Chapter"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
