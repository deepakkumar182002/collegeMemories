import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ['chapter', 'memory'],
      required: [true, 'Target type is required'],
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Target ID is required'],
      index: true,
    },
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      default: 'Alumni Friend',
    },
    authorAvatar: {
      type: String,
      default: '🎓',
    },
    content: {
      type: String,
      required: [true, 'Comment message is required'],
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

commentSchema.index({ targetType: 1, targetId: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', commentSchema);
