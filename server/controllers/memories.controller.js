import { Memory } from '../models/Memory.js';
import { Chapter } from '../models/Chapter.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { memorySchema } from '../validations/schemas.js';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '../services/cloudinary.service.js';

// @desc   Get all memories with filters
// @route  GET /api/memories
// @access Public (published) / Admin (all)
export const getMemories = async (req, res, next) => {
  try {
    const {
      chapter,
      year,
      mediaType,
      isFeatured,
      tag,
      search,
      includeUnpublished,
      sort = 'displayOrder',
      limit,
      page = 1,
    } = req.query;

    const filter = {};

    if (includeUnpublished !== 'true') {
      filter.isPublished = true;
    }

    if (chapter) {
      if (chapter.match(/^[0-9a-fA-F]{24}$/)) {
        filter.chapter = chapter;
      } else {
        const foundChapter = await Chapter.findOne({ slug: chapter });
        if (foundChapter) {
          filter.chapter = foundChapter._id;
        }
      }
    }

    if (year) {
      filter.year = year;
    }

    if (mediaType) {
      filter.mediaType = mediaType;
    }

    if (isFeatured !== undefined) {
      filter.isFeatured = isFeatured === 'true';
    }

    if (tag) {
      filter.tags = { $in: [new RegExp(tag, 'i')] };
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { caption: searchRegex },
        { location: searchRegex },
        { tags: { $in: [searchRegex] } },
        { people: { $in: [searchRegex] } },
      ];
    }

    let query = Memory.find(filter).populate('chapter', 'title slug chapterNumber accentColor theme');

    if (sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else if (sort === 'oldest') {
      query = query.sort({ createdAt: 1 });
    } else {
      query = query.sort({ displayOrder: 1, createdAt: 1 });
    }

    const total = await Memory.countDocuments(filter);

    if (limit) {
      const numLimit = parseInt(limit, 10);
      const numPage = parseInt(page, 10);
      query = query.skip((numPage - 1) * numLimit).limit(numLimit);
    }

    const memories = await query.exec();

    return successResponse(res, {
      memories,
      total,
      page: parseInt(page, 10),
      limit: limit ? parseInt(limit, 10) : total,
    }, 'Memories retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Get single memory by ID
// @route  GET /api/memories/:id
// @access Public
export const getMemoryById = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id).populate('chapter');
    if (!memory) {
      return errorResponse(res, 'Memory not found', 404);
    }

    // Get previous and next memory within the same chapter or overall
    const prevMemory = await Memory.findOne({
      chapter: memory.chapter._id,
      displayOrder: { $lt: memory.displayOrder },
      isPublished: true,
    })
      .sort({ displayOrder: -1 })
      .select('_id title caption media');

    const nextMemory = await Memory.findOne({
      chapter: memory.chapter._id,
      displayOrder: { $gt: memory.displayOrder },
      isPublished: true,
    })
      .sort({ displayOrder: 1 })
      .select('_id title caption media');

    return successResponse(res, {
      memory,
      adjacent: { prev: prevMemory, next: nextMemory },
    }, 'Memory retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Create memory
// @route  POST /api/memories
// @access Private (Admin)
export const createMemory = async (req, res, next) => {
  try {
    const parseResult = memorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return errorResponse(res, parseResult.error.errors[0].message, 400);
    }

    const memoryData = { ...req.body };

    // Format tags and people if passed as comma strings
    if (typeof memoryData.tags === 'string') {
      memoryData.tags = memoryData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (typeof memoryData.people === 'string') {
      memoryData.people = memoryData.people.split(',').map((p) => p.trim()).filter(Boolean);
    }

    // Upload media file if provided
    if (req.file) {
      const isVideo = req.file.mimetype.startsWith('video');
      const isGif = req.file.mimetype === 'image/gif';
      const resourceType = isVideo ? 'video' : 'image';
      const ext = req.file.originalname.split('.').pop();

      const uploaded = await uploadMediaToCloudinary(req.file.buffer, {
        folder: 'college-memories/memories',
        resourceType,
        extension: ext,
      });

      memoryData.media = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
        thumbnail: uploaded.thumbnail,
      };

      if (!memoryData.mediaType) {
        memoryData.mediaType = isVideo ? 'video' : isGif ? 'gif' : 'image';
      }
    } else if (req.body.mediaUrl) {
      // Allowed direct media URL if passed
      memoryData.media = {
        url: req.body.mediaUrl,
        publicId: '',
        resourceType: memoryData.mediaType === 'video' ? 'video' : 'image',
        thumbnail: req.body.thumbnailUrl || req.body.mediaUrl,
      };
    }

    if (memoryData.displayOrder === undefined) {
      const count = await Memory.countDocuments({ chapter: memoryData.chapter });
      memoryData.displayOrder = count + 1;
    }

    const memory = await Memory.create(memoryData);
    const populated = await Memory.findById(memory._id).populate('chapter');

    return successResponse(res, { memory: populated }, 'Memory created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc   Update memory
// @route  PUT /api/memories/:id
// @access Private (Admin)
export const updateMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return errorResponse(res, 'Memory not found', 404);
    }

    const updateData = { ...req.body };

    if (typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map((t) => t.trim()).filter(Boolean);
    }
    if (typeof updateData.people === 'string') {
      updateData.people = updateData.people.split(',').map((p) => p.trim()).filter(Boolean);
    }

    // Handle new media upload
    if (req.file) {
      if (memory.media?.publicId) {
        await deleteMediaFromCloudinary(memory.media.publicId, memory.media.resourceType || 'image');
      }

      const isVideo = req.file.mimetype.startsWith('video');
      const isGif = req.file.mimetype === 'image/gif';
      const resourceType = isVideo ? 'video' : 'image';
      const ext = req.file.originalname.split('.').pop();

      const uploaded = await uploadMediaToCloudinary(req.file.buffer, {
        folder: 'college-memories/memories',
        resourceType,
        extension: ext,
      });

      updateData.media = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        resourceType: uploaded.resourceType,
        thumbnail: uploaded.thumbnail,
      };

      if (!updateData.mediaType) {
        updateData.mediaType = isVideo ? 'video' : isGif ? 'gif' : 'image';
      }
    } else if (req.body.mediaUrl) {
      updateData.media = {
        url: req.body.mediaUrl,
        publicId: memory.media?.publicId || '',
        resourceType: updateData.mediaType === 'video' ? 'video' : 'image',
        thumbnail: req.body.thumbnailUrl || req.body.mediaUrl,
      };
    }

    const updatedMemory = await Memory.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate('chapter');

    return successResponse(res, { memory: updatedMemory }, 'Memory updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Delete memory
// @route  DELETE /api/memories/:id
// @access Private (Admin)
export const deleteMemory = async (req, res, next) => {
  try {
    const memory = await Memory.findById(req.params.id);
    if (!memory) {
      return errorResponse(res, 'Memory not found', 404);
    }

    if (memory.media?.publicId) {
      await deleteMediaFromCloudinary(memory.media.publicId, memory.media.resourceType || 'image');
    }

    await Memory.findByIdAndDelete(req.params.id);

    return successResponse(res, null, 'Memory deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Reorder memories
// @route  PATCH /api/memories/reorder
// @access Private (Admin)
export const reorderMemories = async (req, res, next) => {
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

    await Memory.bulkWrite(bulkOps);

    return successResponse(res, null, 'Memories reordered successfully');
  } catch (error) {
    next(error);
  }
};
