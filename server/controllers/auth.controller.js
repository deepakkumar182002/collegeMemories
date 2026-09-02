import { Admin } from '../models/Admin.js';
import { generateToken, clearTokenCookie } from '../utils/generateToken.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { loginSchema } from '../validations/schemas.js';

// @desc   Admin login
// @route  POST /api/auth/login
// @access Public
export const login = async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      return errorResponse(res, parseResult.error.errors[0].message, 400);
    }

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return errorResponse(res, 'Invalid email or password', 401);
    }

    const token = generateToken(res, admin._id);

    return successResponse(res, {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage,
      },
      token,
    }, 'Login successful');
  } catch (error) {
    next(error);
  }
};

// @desc   Get current logged in admin
// @route  GET /api/auth/me
// @access Private
export const getMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id);
    return successResponse(res, { admin }, 'Admin profile retrieved');
  } catch (error) {
    next(error);
  }
};

// @desc   Admin logout
// @route  POST /api/auth/logout
// @access Private
export const logout = async (req, res) => {
  clearTokenCookie(res);
  return successResponse(res, null, 'Logged out successfully');
};
