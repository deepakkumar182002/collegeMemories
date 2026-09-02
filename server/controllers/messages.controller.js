import { Message } from '../models/Message.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { messageSchema } from '../validations/schemas.js';

// @desc   Get all memory wall messages
// @route  GET /api/messages
// @access Public / Admin
export const getMessages = async (req, res, next) => {
  try {
    const { includeUnpublished } = req.query;
    const filter = includeUnpublished === 'true' ? {} : { isPublished: true };

    const messages = await Message.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    return successResponse(res, { messages }, 'Messages retrieved successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Create message (Public memory wall note)
// @route  POST /api/messages
// @access Public / Admin
export const createMessage = async (req, res, next) => {
  try {
    const parseResult = messageSchema.safeParse(req.body);
    if (!parseResult.success) {
      return errorResponse(res, parseResult.error.errors[0].message, 400);
    }

    const messageData = { ...req.body };

    // Random rotation between -6 and 6 deg if not provided
    if (messageData.rotation === undefined) {
      messageData.rotation = Math.floor(Math.random() * 11) - 5;
    }

    const message = await Message.create(messageData);
    return successResponse(res, { message }, 'Note added to memory wall!', 201);
  } catch (error) {
    next(error);
  }
};

// @desc   Update message
// @route  PUT /api/messages/:id
// @access Private (Admin)
export const updateMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }
    return successResponse(res, { message }, 'Message updated successfully');
  } catch (error) {
    next(error);
  }
};

// @desc   Delete message
// @route  DELETE /api/messages/:id
// @access Private (Admin)
export const deleteMessage = async (req, res, next) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }
    return successResponse(res, null, 'Message deleted successfully');
  } catch (error) {
    next(error);
  }
};
