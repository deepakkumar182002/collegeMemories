import mongoose from 'mongoose';

const memorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Memory title is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    caption: {
      type: String,
      default: '',
      trim: true,
    },
    chapter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chapter',
      required: [true, 'Chapter is required'],
      index: true,
    },
    memoryDate: {
      type: String,
      default: '',
    },
    year: {
      type: String,
      default: '',
    },
    mediaType: {
      type: String,
      enum: ['image', 'video', 'gif', 'text'],
      default: 'image',
    },
    media: {
      url: {
        type: String,
        default: '',
      },
      publicId: {
        type: String,
        default: '',
      },
      resourceType: {
        type: String,
        enum: ['image', 'video', 'raw', 'auto'],
        default: 'image',
      },
      thumbnail: {
        type: String,
        default: '',
      },
    },
    emoji: {
      type: String,
      default: '📸',
    },
    location: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    people: {
      type: [String],
      default: [],
    },
    rotation: {
      type: Number,
      default: 0, // e.g. -4, -2, 0, 3, 5
    },
    layoutStyle: {
      type: String,
      enum: ['polaroid', 'sticky-note', 'film-frame', 'notebook-card', 'ticket', 'postcard'],
      default: 'polaroid',
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
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

memorySchema.index({ chapter: 1, displayOrder: 1 });
memorySchema.index({ tags: 1 });
memorySchema.index({ isFeatured: 1, isPublished: 1 });

export const Memory = mongoose.model('Memory', memorySchema);
