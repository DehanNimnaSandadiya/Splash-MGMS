import { asyncHandler } from '../utils/errorHandler.util.js';
import { AppError } from '../utils/errorHandler.util.js';

export const authorize = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError('Unauthorized', 401);
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError('Forbidden: Insufficient permissions', 403);
    }
    next();
  });
};

