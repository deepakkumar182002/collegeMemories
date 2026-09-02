export interface Admin {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'superadmin';
  profileImage?: string;
  createdAt?: string;
}

export type LayoutStyle =
  | 'polaroid'
  | 'sticky-note'
  | 'film-frame'
  | 'notebook-card'
  | 'ticket'
  | 'postcard';

export type ChapterLayoutStyle =
  | 'polaroid-grid'
  | 'scrapbook-collage'
  | 'film-strip'
  | 'sticky-wall'
  | 'cinematic'
  | 'masonry'
  | 'split-story'
  | 'fullscreen-image';

export type MediaType = 'image' | 'video' | 'gif' | 'text';

export interface MediaObject {
  url: string;
  publicId?: string;
  resourceType?: 'image' | 'video' | 'raw' | 'auto';
  thumbnail?: string;
}

export interface Chapter {
  _id: string;
  title: string;
  slug: string;
  chapterNumber: number;
  shortDescription?: string;
  fullDescription?: string;
  year?: string;
  startDate?: string;
  endDate?: string;
  coverImage?: string;
  coverImagePublicId?: string;
  theme?: string;
  icon?: string;
  emoji?: string;
  backgroundStyle?: string;
  accentColor?: string;
  layoutStyle?: ChapterLayoutStyle;
  displayOrder: number;
  isPublished: boolean;
  reactions?: Record<string, number>;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  _id: string;
  title: string;
  description?: string;
  caption?: string;
  chapter: Chapter | string;
  memoryDate?: string;
  year?: string;
  mediaType: MediaType;
  media: MediaObject;
  emoji?: string;
  location?: string;
  tags?: string[];
  people?: string[];
  rotation?: number;
  layoutStyle: LayoutStyle;
  displayOrder: number;
  isFeatured: boolean;
  isPublished: boolean;
  reactions?: Record<string, number>;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface AlumniComment {
  _id: string;
  targetType: 'chapter' | 'memory';
  targetId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type Comment = AlumniComment;

export interface ReactionStats {
  targetId: string;
  targetType: 'chapter' | 'memory';
  reactions: Record<string, number>;
  likesCount: number;
  commentCount: number;
}

export interface Friend {
  _id: string;
  name: string;
  nickname?: string;
  profileImage?: string;
  profileImagePublicId?: string;
  shortDescription?: string;
  favoriteMemory?: string;
  funTitle?: string;
  emoji?: string;
  batch?: string;
  idNumber?: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  displayOrder: number;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  _id: string;
  authorName: string;
  message: string;
  emoji?: string;
  style: 'yellow' | 'pink' | 'purple' | 'blue' | 'green' | 'orange' | 'cream';
  rotation: number;
  displayOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export interface SiteSettings {
  _id?: string;
  siteName: string;
  collegeName: string;
  collegeLogo?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  heroImage: string;
  heroImagePublicId?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  footerText: string;
  socialLinks?: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  seoTitle?: string;
  seoDescription?: string;
  seoImage?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data: T;
  errors?: any;
}

