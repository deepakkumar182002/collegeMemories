import { Settings } from '../models/Settings.js';
import { Memory } from '../models/Memory.js';
import { Chapter } from '../models/Chapter.js';
import { Friend } from '../models/Friend.js';
import { Message } from '../models/Message.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { settingsSchema } from '../validations/schemas.js';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '../services/cloudinary.service.js';

// @desc   Get site settings & statistics
// @route  GET /api/settings
// @access Public
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    // Include quick public stats
    const totalMemories = await Memory.countDocuments({ isPublished: true });
    const totalChapters = await Chapter.countDocuments({ isPublished: true });
    const totalFriends = await Friend.countDocuments({ isPublished: true });
    const totalPhotos = await Memory.countDocuments({ isPublished: true, mediaType: 'image' });
    const totalVideos = await Memory.countDocuments({ isPublished: true, mediaType: 'video' });

    return successResponse(res, {
      settings,
      stats: {
        totalMemories,
        totalChapters,
        totalFriends,
        totalPhotos,
        totalVideos,
      },
    }, 'Settings retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Update site settings
// @route  PUT /api/settings
// @access Private (Admin)
export const updateSettings = async (req, res, next) => {
  try {
    const parseResult = settingsSchema.safeParse(req.body);
    if (!parseResult.success) {
      return errorResponse(res, parseResult.error.errors[0].message, 400);
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({});
    }

    const updateData = { ...req.body };

    // Handle hero image upload
    if (req.file) {
      if (settings.heroImagePublicId) {
        await deleteMediaFromCloudinary(settings.heroImagePublicId, 'image');
      }
      const ext = req.file.originalname.split('.').pop();
      const uploaded = await uploadMediaToCloudinary(req.file.buffer, {
        folder: 'college-memories/hero',
        extension: ext,
        resourceType: 'image',
      });
      updateData.heroImage = uploaded.url;
      updateData.heroImagePublicId = uploaded.publicId;
    }

    Object.assign(settings, updateData);
    await settings.save();

    return successResponse(res, { settings }, 'Settings updated successfully');
  } catch (error) {
    next(error);
  }
};
