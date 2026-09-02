import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useQueryClient } from '@tanstack/react-query';
import { Settings as SettingsIcon, UploadCloud, Check, Sparkles } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useData';
import { settingsApi } from '../../api';
import { formatMediaUrl } from '../../lib/utils';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { toast } from 'sonner';

export const AdminSettingsPage: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: settingsData, isLoading } = useSiteSettings();

  const [siteName, setSiteName] = useState('');
  const [collegeName, setCollegeName] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroDescription, setHeroDescription] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#570000');
  const [secondaryColor, setSecondaryColor] = useState('#565e77');
  const [accentColor, setAccentColor] = useState('#ffdf96');
  const [footerText, setFooterText] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (settingsData?.settings) {
      const s = settingsData.settings;
      setSiteName(s.siteName || 'AlumniScraps');
      setCollegeName(s.collegeName || 'St. Xavier’s Institute of Technology');
      setHeroTitle(s.heroTitle || '');
      setHeroSubtitle(s.heroSubtitle || '');
      setHeroDescription(s.heroDescription || '');
      setPrimaryColor(s.primaryColor || '#570000');
      setSecondaryColor(s.secondaryColor || '#565e77');
      setAccentColor(s.accentColor || '#ffdf96');
      setFooterText(s.footerText || '');
      setInstagram(s.socialLinks?.instagram || '');
      setLinkedin(s.socialLinks?.linkedin || '');
      setYoutube(s.socialLinks?.youtube || '');
      setSeoTitle(s.seoTitle || '');
      setSeoDescription(s.seoDescription || '');

      if (s.heroImage) {
        setHeroPreview(formatMediaUrl(s.heroImage));
      }
    }
  }, [settingsData]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    maxFiles: 1,
    onDrop: (accepted) => {
      if (accepted[0]) {
        setHeroFile(accepted[0]);
        setHeroPreview(URL.createObjectURL(accepted[0]));
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('siteName', siteName.trim());
    formData.append('collegeName', collegeName.trim());
    formData.append('heroTitle', heroTitle.trim());
    formData.append('heroSubtitle', heroSubtitle.trim());
    formData.append('heroDescription', heroDescription.trim());
    formData.append('primaryColor', primaryColor);
    formData.append('secondaryColor', secondaryColor);
    formData.append('accentColor', accentColor);
    formData.append('footerText', footerText.trim());
    formData.append('socialLinks[instagram]', instagram.trim());
    formData.append('socialLinks[linkedin]', linkedin.trim());
    formData.append('socialLinks[youtube]', youtube.trim());
    formData.append('seoTitle', seoTitle.trim());
    formData.append('seoDescription', seoDescription.trim());

    if (heroFile) {
      formData.append('heroImage', heroFile);
    }

    try {
      await settingsApi.update(formData);
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      toast.success('Site settings updated successfully! ✨');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading site settings..." />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Site Configuration & Branding</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Customize website title, college branding, hero scrapbook artwork, colors, and SEO.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          
          {/* General Branding */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Site Name *
              </label>
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College / Institution Name *
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50"
              />
            </div>
          </div>

          {/* Hero Scrapbook Background Artwork */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Hero Scrapbook Spread Image
            </label>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50/50 rounded-2xl p-6 text-center cursor-pointer transition-colors"
            >
              <input {...getInputProps()} />
              {heroPreview ? (
                <div className="space-y-2">
                  <img src={heroPreview} alt="Hero Preview" className="max-h-56 rounded-xl object-contain mx-auto shadow-sm" />
                  <p className="text-xs text-slate-400">Click or drag new artwork to replace</p>
                </div>
              ) : (
                <div className="py-4 flex flex-col items-center">
                  <UploadCloud className="w-8 h-8 text-rose-800 mb-2" />
                  <p className="text-xs font-semibold text-slate-700">Upload open scrapbook hero image</p>
                </div>
              )}
            </div>
          </div>

          {/* Hero Copy */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Headline
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => setHeroTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Hero Subtitle
            </label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => setHeroSubtitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50"
            />
          </div>

          {/* Theme Colors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Brand (Maroon)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-slate-600">{primaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Secondary (Navy)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <span className="text-xs font-mono text-slate-600">{secondaryColor}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Accent (Mustard)
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
          </div>

          {/* Social Links & Footer Text */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Instagram Link
              </label>
              <input
                type="text"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn Link
              </label>
              <input
                type="text"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                YouTube Link
              </label>
              <input
                type="text"
                value={youtube}
                onChange={(e) => setYoutube(e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Footer Legacy Text
            </label>
            <input
              type="text"
              value={footerText}
              onChange={(e) => setFooterText(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-medium bg-slate-50/50"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-rose-900 hover:bg-rose-950 text-white px-7 py-3 rounded-xl font-montserrat text-xs font-bold uppercase tracking-wider shadow-md transition-all flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            {isSubmitting ? 'Saving Settings...' : 'Save Site Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};
