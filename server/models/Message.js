import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    authorName: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true,
      maxlength: 500,
    },
    emoji: {
      type: String,
      default: '💌',
    },
    style: {
      type: String,
      enum: ['yellow', 'pink', 'purple', 'blue', 'green', 'orange', 'cream'],
      default: 'yellow',
    },
    rotation: {
      type: Number,
      default: 0,
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

messageSchema.index({ displayOrder: 1, createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);
