import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    siteName: {
      type: String,
      default: 'AlumniScraps',
      trim: true,
    },
    collegeName: {
      type: String,
      default: 'St. Xavier’s Institute of Technology',
      trim: true,
    },
    collegeLogo: {
      type: String,
      default: '',
    },
    heroTitle: {
      type: String,
      default: 'Some places become memories. Some people become family.',
      trim: true,
    },
    heroSubtitle: {
      type: String,
      default: 'A journey that started as strangers and ended with unforgettable memories.',
      trim: true,
    },
    heroDescription: {
      type: String,
      default: 'Welcome to the interactive digital scrapbook of our college life. Scroll down to travel through time.',
      trim: true,
    },
    heroImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1200&auto=format&fit=crop',
    },
    heroImagePublicId: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#570000',
    },
    secondaryColor: {
      type: String,
      default: '#565e77',
    },
    accentColor: {
      type: String,
      default: '#ffdf96',
    },
    footerText: {
      type: String,
      default: 'Crafted with nostalgia & love for the Class of 2020-2024. Forever in our hearts.',
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      website: { type: String, default: '' },
    },
    seoTitle: {
      type: String,
      default: 'AlumniScraps - Interactive College Memory Book',
    },
    seoDescription: {
      type: String,
      default: 'A digital time-capsule scrapbook documenting our 4 years of college memories, friendships, canteen stories, and laughter.',
    },
    seoImage: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Settings = mongoose.model('Settings', settingsSchema);
