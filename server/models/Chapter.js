import mongoose from 'mongoose';
import slugify from 'slugify';

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    chapterNumber: {
      type: Number,
      required: [true, 'Chapter number is required'],
    },
    shortDescription: {
      type: String,
      default: '',
      trim: true,
    },
    fullDescription: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: String,
      default: '',
    },
    startDate: {
      type: String,
      default: '',
    },
    endDate: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    coverImagePublicId: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'scrapbook',
    },
    icon: {
      type: String,
      default: 'book-open',
    },
    emoji: {
      type: String,
      default: '✨',
    },
    backgroundStyle: {
      type: String,
      default: 'warm-paper',
    },
    accentColor: {
      type: String,
      default: '#570000',
    },
    layoutStyle: {
      type: String,
      enum: [
        'polaroid-grid',
        'scrapbook-collage',
        'film-strip',
        'sticky-wall',
        'cinematic',
        'masonry',
        'split-story',
        'fullscreen-image',
      ],
      default: 'scrapbook-collage',
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

// Auto-generate slug before save
chapterSchema.pre('validate', function (next) {
  if (this.title && (!this.slug || this.isModified('title'))) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + this.chapterNumber;
  }
  next();
});

export const Chapter = mongoose.model('Chapter', chapterSchema);
