import { Friend } from '../models/Friend.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { friendSchema } from '../validations/schemas.js';
import { uploadMediaToCloudinary, deleteMediaFromCloudinary } from '../services/cloudinary.service.js';

// @desc   Get all friends
// @route  GET /api/friends
// @access Public / Admin
export const getFriends = async (req, res, next) => {
  try {
    const { includeUnpublished } = req.query;
    const filter = includeUnpublished === 'true' ? {} : { isPublished: true };

    const friends = await Friend.find(filter).sort({ displayOrder: 1, createdAt: 1 });
    return successResponse(res, { friends }, 'Friends retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Get single friend
// @route  GET /api/friends/:id
// @access Public
export const getFriendById = async (req, res, next) => {
  try {
    const friend = await Friend.findById(req.params.id);
    if (!friend) {
      return errorResponse(res, 'Friend not found', 404);
    }
    return successResponse(res, { friend }, 'Friend retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Create friend
// @route  POST /api/friends
// @access Private (Admin)
export const createFriend = async (req, res, next) => {
  try {
    const parseResult = friendSchema.safeParse(req.body);
    if (!parseResult.success) {
      return errorResponse(res, parseResult.error.errors[0].message, 400);
    }

    const friendData = { ...req.body };

    if (req.file) {
      const ext = req.file.originalname.split('.').pop();
      const uploaded = await uploadMediaToCloudinary(req.file.buffer, {
        folder: 'college-memories/friends',
        extension: ext,
        resourceType: 'image',
      });
      friendData.profileImage = uploaded.url;
      friendData.profileImagePublicId = uploaded.publicId;
    } else if (req.body.profileImageUrl) {
      friendData.profileImage = req.body.profileImageUrl;
    }

    if (friendData.displayOrder === undefined) {
      const count = await Friend.countDocuments();
      friendData.displayOrder = count + 1;
    }

    const friend = await Friend.create(friendData);
    return successResponse(res, { friend }, 'Friend added successfully', 201);
  } catch (error) {
    next(error);
  }
};

// @desc   Update friend
// @route  PUT /api/friends/:id
// @access Private (Admin)
export const updateFriend = async (req, res, next) => {
  try {
    const friend = await Friend.findById(req.params.id);
    if (!friend) {
      return errorResponse(res, 'Friend not found', 404);
    }

    const updateData = { ...req.body };

    if (req.file) {
      if (friend.profileImagePublicId) {
        await deleteMediaFromCloudinary(friend.profileImagePublicId, 'image');
      }
      const ext = req.file.originalname.split('.').pop();
      const uploaded = await uploadMediaToCloudinary(req.file.buffer, {
        folder: 'college-memories/friends',
        extension: ext,
        resourceType: 'image',
      });
      updateData.profileImage = uploaded.url;
      updateData.profileImagePublicId = uploaded.publicId;
    } else if (req.body.profileImageUrl) {
      updateData.profileImage = req.body.profileImageUrl;
    }

    const updated = await Friend.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    return successResponse(res, { friend: updated }, 'Friend updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Delete friend
// @route  DELETE /api/friends/:id
// @access Private (Admin)
export const deleteFriend = async (req, res, next) => {
  try {
    const friend = await Friend.findById(req.params.id);
    if (!friend) {
      return errorResponse(res, 'Friend not found', 404);
    }

    if (friend.profileImagePublicId) {
      await deleteMediaFromCloudinary(friend.profileImagePublicId, 'image');
    }

    await Friend.findByIdAndDelete(req.params.id);
    return successResponse(res, null, 'Friend deleted successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Reorder friends
// @route  PATCH /api/friends/reorder
// @access Private (Admin)
export const reorderFriends = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return errorResponse(res, 'Items array is required', 400);
    }

    const bulkOps = items.map((item) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { displayOrder: item.displayOrder } },
      },
    }));

    await Friend.bulkWrite(bulkOps);
    return successResponse(res, null, 'Friends reordered successfully');
  } catch (error) {
    next(error);
  }
};
