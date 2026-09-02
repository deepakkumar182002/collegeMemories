import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const chapterSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  chapterNumber: z.coerce.number().min(1, 'Chapter number is required'),
  shortDescription: z.string().optional(),
  fullDescription: z.string().optional(),
  year: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  coverImage: z.string().optional(),
  coverImagePublicId: z.string().optional(),
  theme: z.string().optional(),
  icon: z.string().optional(),
  emoji: z.string().optional(),
  backgroundStyle: z.string().optional(),
  accentColor: z.string().optional(),
  layoutStyle: z
    .enum([
      'polaroid-grid',
      'scrapbook-collage',
      'film-strip',
      'sticky-wall',
      'cinematic',
      'masonry',
      'split-story',
      'fullscreen-image',
    ])
    .optional(),
  displayOrder: z.coerce.number().optional(),
  isPublished: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
});

export const memorySchema = z.object({
  title: z.string().min(2, 'Title is required'),
  description: z.string().optional(),
  caption: z.string().optional(),
  chapter: z.string().min(1, 'Chapter is required'),
  memoryDate: z.string().optional(),
  year: z.string().optional(),
  mediaType: z.enum(['image', 'video', 'gif', 'text']).optional(),
  emoji: z.string().optional(),
  location: z.string().optional(),
  tags: z.union([z.array(z.string()), z.string().transform((v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []))]).optional(),
  people: z.union([z.array(z.string()), z.string().transform((v) => (v ? v.split(',').map((s) => s.trim()).filter(Boolean) : []))]).optional(),
  rotation: z.coerce.number().optional(),
  layoutStyle: z.enum(['polaroid', 'sticky-note', 'film-frame', 'notebook-card', 'ticket', 'postcard']).optional(),
  displayOrder: z.coerce.number().optional(),
  isFeatured: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
  isPublished: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
});

export const friendSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  nickname: z.string().optional(),
  shortDescription: z.string().optional(),
  favoriteMemory: z.string().optional(),
  funTitle: z.string().optional(),
  emoji: z.string().optional(),
  batch: z.string().optional(),
  idNumber: z.string().optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
  displayOrder: z.coerce.number().optional(),
  isPublished: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
});

export const messageSchema = z.object({
  authorName: z.string().min(1, 'Author name is required'),
  message: z.string().min(1, 'Message is required').max(500, 'Max 500 characters'),
  emoji: z.string().optional(),
  style: z.enum(['yellow', 'pink', 'purple', 'blue', 'green', 'orange', 'cream']).optional(),
  rotation: z.coerce.number().optional(),
  displayOrder: z.coerce.number().optional(),
  isPublished: z.union([z.boolean(), z.string().transform((v) => v === 'true')]).optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().optional(),
  collegeName: z.string().optional(),
  collegeLogo: z.string().optional(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  heroImagePublicId: z.string().optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  footerText: z.string().optional(),
  socialLinks: z
    .object({
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      youtube: z.string().optional(),
      website: z.string().optional(),
    })
    .optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoImage: z.string().optional(),
});
