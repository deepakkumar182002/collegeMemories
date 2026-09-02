import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, UploadCloud, Film, Image as ImageIcon, Sparkles, Check, Trash2 } from 'lucide-react';
import { useChapters, useMemory } from '../../hooks/useData';
import { memoriesApi } from '../../api';
import { formatMediaUrl } from '../../lib/utils';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';

export const AdminMemoryEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: chapters = [] } = useChapters(true);
  const { data: memoryData, isLoading: memoryLoading } = useMemory(id || '');

  // Form Fields State
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [description, setDescription] = useState('');
  const [chapter, setChapter] = useState('');
  const [memoryDate, setMemoryDate] = useState('');
  const [year, setYear] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'gif' | 'text'>('image');
  const [emoji, setEmoji] = useState('📸');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState('');
  const [people, setPeople] = useState('');
  const [rotation, setRotation] = useState(0);
  const [layoutStyle, setLayoutStyle] = useState<'polaroid' | 'sticky-note' | 'film-frame' | 'notebook-card' | 'ticket' | 'postcard'>('polaroid');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);

  // File Upload State
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate data in edit mode
  useEffect(() => {
    if (isEdit && memoryData?.memory) {
      const m = memoryData.memory;
      setTitle(m.title || '');
      setCaption(m.caption || '');
      setDescription(m.description || '');
      setChapter(typeof m.chapter === 'object' ? m.chapter._id : m.chapter || '');
      setMemoryDate(m.memoryDate || '');
      setYear(m.year || '');
      setMediaType(m.mediaType || 'image');
      setEmoji(m.emoji || '📸');
      setLocation(m.location || '');
      setTags(Array.isArray(m.tags) ? m.tags.join(', ') : '');
      setPeople(Array.isArray(m.people) ? m.people.join(', ') : '');
      setRotation(m.rotation || 0);
      setLayoutStyle(m.layoutStyle || 'polaroid');
      setIsFeatured(Boolean(m.isFeatured));
      setIsPublished(m.isPublished !== undefined ? m.isPublished : true);

      if (m.media?.url) {
        setPreviewUrl(formatMediaUrl(m.media.url));
      }
    } else if (!isEdit && chapters.length > 0 && !chapter) {
      setChapter(chapters[0]._id);
    }
  }, [isEdit, memoryData, chapters]);

  // React Dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles[0]) {
        const file = acceptedFiles[0];
        setMediaFile(file);
        setPreviewUrl(URL.createObjectURL(file));

        if (file.type.startsWith('video/')) {
          setMediaType('video');
          if (layoutStyle === 'polaroid') setLayoutStyle('film-frame');
        } else if (file.type === 'image/gif') {
          setMediaType('gif');
        } else {
          setMediaType('image');
        }
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !chapter) {
      toast.error('Please fill in required fields (Title and Chapter)');
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('title', title.trim());
    formData.append('caption', caption.trim());
    formData.append('description', description.trim());
    formData.append('chapter', chapter);
    formData.append('memoryDate', memoryDate.trim());
    formData.append('year', year.trim());
    formData.append('mediaType', mediaType);
    formData.append('emoji', emoji);
    formData.append('location', location.trim());
    formData.append('tags', tags);
    formData.append('people', people);
    formData.append('rotation', String(rotation));
    formData.append('layoutStyle', layoutStyle);
    formData.append('isFeatured', String(isFeatured));
    formData.append('isPublished', String(isPublished));

    if (mediaFile) {
      formData.append('mediaFile', mediaFile);
    }

    try {
      if (isEdit && id) {
        await memoriesApi.update(id, formData);
        toast.success('Memory updated successfully! ✨');
      } else {
        await memoriesApi.create(formData);
        toast.success('New memory created and archived! 📸');
      }
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      navigate('/admin/memories');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save memory');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEdit && memoryLoading) {
    return <LoadingSpinner message="Loading memory editor..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate('/admin/memories')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Memories
        </button>

        <h1 className="text-xl font-bold text-slate-900">
          {isEdit ? 'Edit Memory Artifact' : 'Archive New College Memory'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          
          {/* Media Upload Dropzone */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Photo / Video / GIF Media
            </label>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-rose-800 bg-rose-50/50' : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input {...getInputProps()} />

              {previewUrl ? (
                <div className="space-y-3">
                  <div className="max-h-64 rounded-xl overflow-hidden inline-block shadow-md bg-black">
                    {mediaType === 'video' ? (
                      <video src={previewUrl} controls className="max-h-64 object-contain" />
                    ) : (
                      <img src={previewUrl} alt="Preview" className="max-h-64 object-contain" />
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">Click or drag new file to replace</p>
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-800 flex items-center justify-center mb-3">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Drag and drop photo or video here</p>
                  <p className="text-xs text-slate-400 mt-1">Supports JPEG, PNG, WEBP, GIF, and MP4 up to 50MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Title & Caption */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Memory Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Canteen Samosa Championship"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-800 bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Handwritten Caption (Caveat Font)
              </label>
              <input
                type="text"
                placeholder="e.g. Raju bhaiya special! ☕"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-800 bg-slate-50/50 font-handwriting text-lg"
              />
            </div>
          </div>

          {/* Chapter & Layout Style Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Story Chapter *
              </label>
              <select
                required
                value={chapter}
                onChange={(e) => setChapter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-800 bg-slate-50/50"
              >
                {chapters.map((ch) => (
                  <option key={ch._id} value={ch._id}>
                    Ch {ch.chapterNumber}: {ch.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Scrapbook Card Style
              </label>
              <select
                value={layoutStyle}
                onChange={(e) => setLayoutStyle(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-800 bg-slate-50/50"
              >
                <option value="polaroid">📷 Classic Polaroid Frame</option>
                <option value="sticky-note">📌 Pastel Sticky Note</option>
                <option value="film-frame">🎬 Vintage Film Frame (Videos)</option>
                <option value="notebook-card">📝 Lined Notebook Card</option>
                <option value="ticket">🎟️ Event Admission Ticket</option>
                <option value="postcard">💌 Stamped Postcard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Card Tilt: {rotation}°
              </label>
              <input
                type="range"
                min="-8"
                max="8"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                className="w-full mt-3 accent-rose-900"
              />
            </div>
          </div>

          {/* Full Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Memory Story & Context
            </label>
            <textarea
              rows={3}
              placeholder="Detailed description of what happened, inside jokes, reflections..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-800 bg-slate-50/50 resize-none"
            />
          </div>

          {/* Date, Location, Emoji */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Date / Time Period
              </label>
              <input
                type="text"
                placeholder="e.g. October 14, 2021"
                value={memoryDate}
                onChange={(e) => setMemoryDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Campus Location
              </label>
              <input
                type="text"
                placeholder="e.g. Central Library Lawn"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Emoji Sticker
              </label>
              <input
                type="text"
                value={emoji}
                onChange={(e) => setEmoji(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-lg text-center bg-slate-50/50"
              />
            </div>
          </div>

          {/* Tags & People */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Tags (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="Orientation, Canteen, Roadtrip"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Batchmates Tagged (Comma-separated)
              </label>
              <input
                type="text"
                placeholder="Sneha, Alex, Rohan, Maya"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50/50"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 pt-2 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded text-rose-900 focus:ring-rose-800"
              />
              Publish Publicly
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 rounded text-rose-900 focus:ring-rose-800"
              />
              Feature on Hero Screen
            </label>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/memories')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-900 hover:bg-rose-950 text-white px-6 py-2.5 rounded-xl font-montserrat text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? 'Saving Memory...' : isEdit ? 'Save Changes' : 'Archive Memory'}
          </button>
        </div>
      </form>
    </div>
  );
};
