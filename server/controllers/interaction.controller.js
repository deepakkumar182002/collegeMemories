import { Chapter } from '../models/Chapter.js';
import { Memory } from '../models/Memory.js';
import { Comment } from '../models/Comment.js';
import { sendInteractionNotification } from '../services/email.service.js';

/**
 * @desc    Submit a reaction (emoji or like) on a Chapter or Memory
 * @route   POST /api/interactions/react
 * @access  Public
 */
export const addReaction = async (req, res, next) => {
  try {
    const { targetType, targetId, emoji = '❤️', type = 'reaction' } = req.body;

    if (!targetType || !targetId) {
      return res.status(400).json({
        success: false,
        message: 'targetType (chapter/memory) and targetId are required.',
      });
    }

    let targetDoc = null;
    if (targetType === 'chapter') {
      targetDoc = await Chapter.findById(targetId);
    } else if (targetType === 'memory') {
      targetDoc = await Memory.findById(targetId);
    } else {
      return res.status(400).json({ success: false, message: 'Invalid targetType' });
    }

    if (!targetDoc) {
      return res.status(404).json({ success: false, message: `${targetType} not found` });
    }

    // Initialize reactions map if needed
    if (!targetDoc.reactions) {
      targetDoc.reactions = new Map();
    }

    // Get current count for this emoji or increment likesCount
    if (type === 'like') {
      targetDoc.likesCount = (targetDoc.likesCount || 0) + 1;
    }

    const currentCount = targetDoc.reactions.get(emoji) || 0;
    targetDoc.reactions.set(emoji, currentCount + 1);

    await targetDoc.save();

    // Asynchronously send email notification via Nodemailer (non-blocking)
    sendInteractionNotification({
      type: type === 'like' ? 'like' : 'reaction',
      targetType: targetType === 'chapter' ? 'Chapter' : 'Memory',
      targetTitle: targetDoc.title || 'Scrapbook Item',
      targetId: targetDoc._id.toString(),
      emoji,
    }).catch((err) => console.error('[Interaction React Email Error]', err.message));

    // Convert reactions Map to plain object for JSON response
    const reactionsObj = targetDoc.reactions instanceof Map 
      ? Object.fromEntries(targetDoc.reactions)
      : targetDoc.reactions;

    res.status(200).json({
      success: true,
      data: {
        targetId: targetDoc._id,
        targetType,
        reactions: reactionsObj,
        likesCount: targetDoc.likesCount || 0,
      },
      message: 'Reaction recorded successfully! ✨',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Post a comment on a Chapter or Memory
 * @route   POST /api/interactions/comments
 * @access  Public
 */
export const addComment = async (req, res, next) => {
  try {
    const { targetType, targetId, authorName, authorAvatar = '🎓', content } = req.body;

    if (!targetType || !targetId || !content?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'targetType, targetId, and comment content are required.',
      });
    }

    let targetDoc = null;
    if (targetType === 'chapter') {
      targetDoc = await Chapter.findById(targetId);
    } else if (targetType === 'memory') {
      targetDoc = await Memory.findById(targetId);
    }

    if (!targetDoc) {
      return res.status(404).json({ success: false, message: `${targetType} not found` });
    }

    const comment = await Comment.create({
      targetType,
      targetId,
      authorName: authorName?.trim() || 'Alumni Friend',
      authorAvatar: authorAvatar || '🎓',
      content: content.trim(),
    });

    // Asynchronously send email notification via Nodemailer (non-blocking)
    sendInteractionNotification({
      type: 'comment',
      targetType: targetType === 'chapter' ? 'Chapter' : 'Memory',
      targetTitle: targetDoc.title || 'Scrapbook Item',
      targetId: targetDoc._id.toString(),
      authorName: comment.authorName,
      authorAvatar: comment.authorAvatar,
      content: comment.content,
    }).catch((err) => console.error('[Interaction Comment Email Error]', err.message));

    res.status(201).json({
      success: true,
      data: {
        comment,
      },
      message: 'Comment posted successfully! 💬',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get comments for a specific Chapter or Memory
 * @route   GET /api/interactions/comments/:targetType/:targetId
 * @access  Public
 */
export const getComments = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;

    const comments = await Comment.find({
      targetType,
      targetId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        comments,
        count: comments.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get stats (reactions + comments count) for a target
 * @route   GET /api/interactions/stats/:targetType/:targetId
 * @access  Public
 */
export const getStats = async (req, res, next) => {
  try {
    const { targetType, targetId } = req.params;

    let targetDoc = null;
    if (targetType === 'chapter') {
      targetDoc = await Chapter.findById(targetId);
    } else if (targetType === 'memory') {
      targetDoc = await Memory.findById(targetId);
    }

    if (!targetDoc) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    const commentCount = await Comment.countDocuments({ targetType, targetId, isApproved: true });

    const reactionsObj = targetDoc.reactions instanceof Map
      ? Object.fromEntries(targetDoc.reactions)
      : targetDoc.reactions || {};

    res.status(200).json({
      success: true,
      data: {
        targetId: targetDoc._id,
        targetType,
        reactions: reactionsObj,
        likesCount: targetDoc.likesCount || 0,
        commentCount,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a comment (Admin moderation)
 * @route   DELETE /api/interactions/comments/:id
 * @access  Private (Admin)
 */
export const deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: 'Comment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully.',
    });
  } catch (error) {
    next(error);
  }
};
