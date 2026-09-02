import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { errorResponse } from '../utils/apiResponse.js';

export const protect = async (req, res, next) => {
  let token = null;

  // 1. Check httpOnly cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // 2. Check Authorization Bearer header
  else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return errorResponse(res, 'Not authorized, no token provided', 401);
  }

  try {
    const secret = process.env.JWT_SECRET || 'super_secret_college_memories_jwt_key_2026_scrapbook';
    const decoded = jwt.verify(token, secret);

    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return errorResponse(res, 'Not authorized, admin no longer exists', 401);
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return errorResponse(res, 'Not authorized, token failed or expired', 401);
  }
};
