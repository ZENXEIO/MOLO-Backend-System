import jwt from 'jsonwebtoken';

import { User } from '../models/user.models.js';
import { ApiError } from '../utils/ApiError.js';

export async function verifyJWT(req, res, next) {
  try {
    // Try cookies first, then Authorization header (Bearer <token>)
    let token = req && req.cookies ? req.cookies.accessToken : undefined;

    if (!token && typeof req.header === 'function') {
      const authHeader = req.header('Authorization') || req.header('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else if (authHeader) {
        token = authHeader;
      }
    }

    if (!token) {
      return next(new ApiError(401, 'No token provided'));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'secret');
    } catch (err) {
      return next(new ApiError(401, 'Invalid token'));
    }

    const user = await User.findById(decoded._id).select('-password');
    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    req.user = user;
    return next();
  } catch (err) {
    return next(new ApiError(401, 'Unauthorized', [], err.stack || ''));
  }
}
