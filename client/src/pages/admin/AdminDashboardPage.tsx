import React from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  BookOpen,
  Users,
  Video,
  MessageSquare,
  PlusCircle,
  ExternalLink,
  Sparkles,
  TrendingUp,
  Clock,
  Settings,
} from 'lucide-react';
import { useChapters, useMemories, useFriends, useMessages, useSiteSettings } from '../../hooks/useData';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { formatMediaUrl } from '../../lib/utils';

export const AdminDashboardPage: React.FC = () => {
  const { data: chapters = [], isLoading: chaptersLoading } = useChapters(true);
  const { data: memoriesData, isLoading: memoriesLoading } = useMemories({ includeUnpublished: true, sort: 'newest', limit: 6 });
  const { data: friends = [], isLoading: friendsLoading } = useFriends(true);
  const { data: messages = [] } = useMessages(true);
  const { data: settingsData } = useSiteSettings();

  const memories = memoriesData?.memories || [];
  const totalMemories = memoriesData?.total || memories.length;

  if (chaptersLoading || memoriesLoading || friendsLoading) {
    return <LoadingSpinner message="Loading dashboard statistics..." />;
  }

  const photosCount = memories.filter((m) => m.mediaType === 'image').length;
  const videosCount = memories.filter((m) => m.mediaType === 'video').length;

  const statCards = [
    { label: 'Total Memories', value: totalMemories, icon: ImageIcon, color: 'bg-rose-50 text-rose-800 border-rose-100', href: '/admin/memories' },
    { label: 'Story Chapters', value: chapters.length, icon: BookOpen, color: 'bg-amber-50 text-amber-800 border-amber-100', href: '/admin/chapters' },
    { label: 'Video Reels', value: videosCount, icon: Video, color: 'bg-blue-50 text-blue-800 border-blue-100', href: '/admin/memories?mediaType=video' },
    { label: 'Batch Friends', value: friends.length, icon: Users, color: 'bg-emerald-50 text-emerald-800 border-emerald-100', href: '/admin/friends' },
    { label: 'Wall Notes', value: messages.length, icon: MessageSquare, color: 'bg-purple-50 text-purple-800 border-purple-100', href: '/admin/messages' },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-rose-800 bg-rose-50 px-2.5 py-1 rounded-md">
            Archive Administration
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mt-2">
            Welcome to Memory Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage chapters, polaroids, videos, and batch stories for{' '}
            <span className="font-semibold text-slate-700">{settingsData?.settings?.collegeName || 'AlumniScraps'}</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/memories/create"
            className="bg-rose-900 hover:bg-rose-950 text-white px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Memory
          </Link>
          <Link
            to="/"
            target="_blank"
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-medium text-xs flex items-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            Live Scrapbook
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link
            key={stat.label}
            to={stat.href}
            className={`p-5 rounded-2xl border ${stat.color} transition-all hover:scale-102 hover:shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold opacity-90">{stat.label}</span>
              <stat.icon className="w-4 h-4 opacity-80" />
            </div>
            <p className="text-2xl md:text-3xl font-bold tracking-tight">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Memories & Quick Management */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <h2 className="text-base font-bold text-slate-800">Recent Memory Artifacts</h2>
          </div>
          <Link
            to="/admin/memories"
            className="text-xs font-semibold text-rose-800 hover:underline"
          >
            View All ({totalMemories}) →
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {memories.map((mem) => {
            const thumb = formatMediaUrl(mem.media?.thumbnail || mem.media?.url);
            const chapterTitle = typeof mem.chapter === 'object' ? mem.chapter?.title : 'Chapter';

            return (
              <div
                key={mem._id}
                className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50/70 transition-colors gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-14 h-14 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {thumb ? (
                      <img src={thumb} alt={mem.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xl">{mem.emoji || '📸'}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded">
                        {chapterTitle}
                      </span>
                      {mem.isFeatured && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-sm text-slate-900 truncate">{mem.title}</h3>
                    <p className="text-xs text-slate-400 truncate">{mem.caption || mem.memoryDate || 'College Memory'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    to={`/admin/memories/${mem._id}/edit`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
