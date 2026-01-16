import { ApiError } from '../utils/ApiError.js';

export const authorizeRoles = (...allowedRoles) => {
  return (req, _, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(301, 'Access desnied');
    }

    next();
  };
};
