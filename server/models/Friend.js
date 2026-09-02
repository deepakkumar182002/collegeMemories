import mongoose from 'mongoose';

const friendSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Friend name is required'],
      trim: true,
    },
    nickname: {
      type: String,
      default: '',
      trim: true,
    },
    profileImage: {
      type: String,
      default: '',
    },
    profileImagePublicId: {
      type: String,
      default: '',
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    favoriteMemory: {
      type: String,
      default: '',
      trim: true,
    },
    funTitle: {
      type: String,
      default: 'The Legend 😎',
      trim: true,
    },
    emoji: {
      type: String,
      default: '🎓',
    },
    batch: {
      type: String,
      default: 'Class of 2024',
    },
    idNumber: {
      type: String,
      default: '',
    },
    socialLinks: {
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      github: { type: String, default: '' },
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

friendSchema.index({ displayOrder: 1 });

export const Friend = mongoose.model('Friend', friendSchema);
