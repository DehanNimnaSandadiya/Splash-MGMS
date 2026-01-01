import { verifyToken } from '../utils/jwt.util.js';
import User from '../models/user.model.js';
import { asyncHandler } from '../utils/errorHandler.util.js';
import { AppError } from '../utils/errorHandler.util.js';

export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new AppError('No token provided', 401);
  }

  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (!user.isActive) {
    throw new AppError('Account is deactivated', 403);
  }

  req.user = {
    userId: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  };
  next();
});

