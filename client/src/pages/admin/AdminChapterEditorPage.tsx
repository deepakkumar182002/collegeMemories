import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, UploadCloud, Check } from 'lucide-react';
import { useChapter } from '../../hooks/useData';
import { chaptersApi } from '../../api';
import { formatMediaUrl } from '../../lib/utils';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';

export const AdminChapterEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: chapterData, isLoading } = useChapter(id || '');

  const [title, setTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [shortDescription, setShortDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [year, setYear] = useState('');
  const [emoji, setEmoji] = useState('📖');
  const [accentColor, setAccentColor] = useState('#570000');
  const [layoutStyle, setLayoutStyle] = useState<string>('scrapbook-collage');
  const [isPublished, setIsPublished] = useState(true);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEdit && chapterData?.chapter) {
      const ch = chapterData.chapter;
      setTitle(ch.title || '');
      setChapterNumber(ch.chapterNumber || 1);
      setShortDescription(ch.shortDescription || '');
      setFullDescription(ch.fullDescription || '');
      setYear(ch.year || '');
      setEmoji(ch.emoji || '📖');
      setAccentColor(ch.accentColor || '#570000');
      setLayoutStyle(ch.layoutStyle || 'scrapbook-collage');
      setIsPublished(ch.isPublished !== undefined ? ch.isPublished : true);

      if (ch.coverImage) {
        setPreviewUrl(formatMediaUrl(ch.coverImage));
      }
    }
  }, [isEdit, chapterData]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: (accepted) => {
      if (accepted[0]) {
        setCoverFile(accepted[0]);
        setPreviewUrl(URL.createObjectURL(accepted[0]));
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Chapter title is required');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('chapterNumber', String(chapterNumber));
    formData.append('shortDescription', shortDescription.trim());
    formData.append('fullDescription', fullDescription.trim());
    formData.append('year', year.trim());
    formData.append('emoji', emoji);
    formData.append('accentColor', accentColor);
    formData.append('layoutStyle', layoutStyle);
    formData.append('isPublished', String(isPublished));

    if (coverFile) {
      formData.append('coverImage', coverFile);
    }

    try {
      if (isEdit && id) {
        await chaptersApi.update(id, formData);
        toast.success('Chapter updated successfully! ✨');
      } else {
        await chaptersApi.create(formData);
        toast.success('New chapter created! 📖');
      }
      queryClient.invalidateQueries({ queryKey: ['chapters'] });
      navigate('/admin/chapters');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save chapter');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && isLoading) {
    return <LoadingSpinner message="Loading chapter editor..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/chapters')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Chapters
        </button>
        <h1 className="text-xl font-bold text-slate-900">
          {isEdit ? 'Edit Story Chapter' : 'Add Story Chapter'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          
          {/* Cover Photo Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Chapter Cover Photo
            </label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
            >
              <input {...getInputProps()} />
              {previewUrl ? (
                <div className="space-y-2">
                  <img src={previewUrl} alt="Cover Preview" className="max-h-56 rounded-xl object-contain mx-auto shadow-sm" />
                  <p className="text-xs text-slate-400">Click or drop new photo to replace</p>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-rose-800 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Upload chapter cover photograph</p>
                </div>
              )}
            </div>
          </div>

          {/* Title & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Chapter # *
              </label>
              <input
                type="number"
                min="1"
                required
                value={chapterNumber}
                onChange={(e) => setChapterNumber(parseInt(e.target.value, 10))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50 focus:ring-2 focus:ring-rose-800"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Chapter Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Canteen Stories & Infinite Chai"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50 focus:ring-2 focus:ring-rose-800"
              />
            </div>
          </div>

          {/* Emoji, Year, Accent Color, Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Emoji
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-lg text-center bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Year / Era
              </label>
              <input
                type="text"
                placeholder="e.g. Year 2 - 2021"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-slate-600">{accentColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Layout Style
              </label>
              <select
                value={layoutStyle}
                onChange={(e) => setLayoutStyle(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
              >
                <option value="scrapbook-collage">Scrapbook Collage</option>
                <option value="polaroid-grid">Polaroid Grid</option>
                <option value="film-strip">Film Strip</option>
                <option value="sticky-wall">Sticky Note Wall</option>
                <option value="cinematic">Cinematic</option>
                <option value="masonry">Masonry</option>
                <option value="split-story">Split Story</option>
                <option value="fullscreen-image">Fullscreen Hero</option>
              </select>
            </div>
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Short Description (Timeline Subtitle)
            </label>
            <input
              type="text"
              placeholder="Brief summary of the chapter..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Chapter Story (Journey Page Narrative)
            </label>
            <textarea
              rows={4}
              placeholder="Detailed reflection on this milestone..."
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50 resize-none"
            />
          </div>

          {/* Published toggle */}
          <div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-rose-900 focus:ring-rose-800"
              />
              Publish Chapter on Public Timeline
            </label>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/chapters')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-900 hover:bg-rose-950 text-white px-6 py-2.5 rounded-xl font-montserrat text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? 'Saving Chapter...' : isEdit ? 'Save Changes' : 'Create Chapter'}
          </button>
        </div>
      </form>
    </div>
  );
};
