import { Chapter } from '../models/Chapter.js';
import { Memory } from '../models/Memory.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { chapterSchema } from '../validations/schemas.js';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '../services/cloudinary.service.js';

// @desc   Get all chapters
// @route  GET /api/chapters
// @access Public (all published) / Admin (all)
export const getChapters = async (req, res, next) => {
  try {
    const { includeUnpublished } = req.query;
    const filter = includeUnpublished === 'true' ? {} : { isPublished: true };

    const chapters = await Chapter.find(filter).sort({ displayOrder: 1, chapterNumber: 1 });

    return successResponse(res, { chapters }, 'Chapters retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Get chapter by slug or ID
// @route  GET /api/chapters/:slug
// @access Public
export const getChapterBySlugOrId = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let chapter = null;

    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      chapter = await Chapter.findById(slug);
    }
    if (!chapter) {
      chapter = await Chapter.findOne({ slug });
    }

    if (!chapter) {
      return errorResponse(res, 'Chapter not found', 404);
    }

    const memories = await Memory.find({
      chapter: chapter._id,
      isPublished: true,
    }).sort({ displayOrder: 1 });

    return successResponse(res, { chapter, memories }, 'Chapter details retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc   Create chapter
// @route  POST /api/chapters
// @access Private (Admin)
export const createChapter = async (req, res, next) => {
  try {
    const parseResult = chapterSchema.safeParse(req.body);
    if (!parseResult.success) {
      return errorResponse(res, parseResult.error.errors[0].message, 400);
    }

    const chapterData = { ...req.body };

    // Handle cover image upload
    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const uploaded = await uploadMediaToCloudinary(req.file.buffer, {
        folder: 'college-memories/chapters',
        extension: ext,
        resourceType: 'image',
      });
      chapterData.coverImage = uploaded.url;
      chapterData.coverImagePublicId = uploaded.publicId;
    }

    // Default display order if not specified
    if (chapterData.displayOrder === undefined) {
      const count = await Chapter.countDocuments();
      chapterData.displayOrder = count + 1;
    }

    const chapter = await Chapter.create(chapterData);
    return successResponse(res, { chapter }, 'Chapter created successfully', 211);
  } catch (error) {
    next(error);
  }
};

// @desc   Update chapter
// @route  PUT /api/chapters/:id
// @access Private (Admin)
export const updateChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return errorResponse(res, 'Chapter not found', 404);
    }

    const updateData = { ...req.body };

    // Handle new cover image upload
    if (req.file) {
      if (chapter.coverImagePublicId) {
        await deleteMediaFromCloudinary(chapter.coverImagePublicId, 'image');
      }
      const ext = req.file.originalname.split('.').pop();
      const uploaded = await uploadMediaToCloudinary(req.file.buffer, {
        folder: 'college-memories/chapters',
        extension: ext,
        resourceType: 'image',
      });
      updateData.coverImage = uploaded.url;
      updateData.coverImagePublicId = uploaded.publicId;
    }

    const updatedChapter = await Chapter.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, { chapter: updatedChapter }, 'Chapter updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Delete chapter
// @route  DELETE /api/chapters/:id
// @access Private (Admin)
export const deleteChapter = async (req, res, next) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return errorResponse(res, 'Chapter not found', 404);
    }

    // Delete cover image
    if (chapter.coverImagePublicId) {
      await deleteMediaFromCloudinary(chapter.coverImagePublicId, 'image');
    }

    // Find and delete associated memories and their media
    const memories = await Memory.find({ chapter: chapter._id });
    for (const mem of memories) {
      if (mem.media?.publicId) {
        await deleteMediaFromCloudinary(mem.media.publicId, mem.media.resourceType || 'image');
      }
    }
    await Memory.deleteMany({ chapter: chapter._id });

    await Chapter.findByIdAndDelete(req.params.id);

    return successResponse(res, null, 'Chapter and associated memories deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Reorder chapters
// @route  PATCH /api/chapters/reorder
// @access Private (Admin)
export const reorderChapters = async (req, res, next) => {
  try {
    const { items } = req.body; // Array of { id, displayOrder }
    if (!Array.isArray(items)) {
      return errorResponse(res, 'Items array is required', 400);
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));

    await Chapter.bulkWrite(bulkOps);

    const chapters = await Chapter.find().sort({ displayOrder: 1 });
    return successResponse(res, { chapters }, 'Chapters reordered successfully');
  } catch (error) {
    next(error);
  }
};
