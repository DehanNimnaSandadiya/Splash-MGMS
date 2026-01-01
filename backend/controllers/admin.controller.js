import User from '../models/user.model.js';
import Media from '../models/media.model.js';
import Contact from '../models/contact.model.js';
import { asyncHandler } from '../utils/errorHandler.util.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../utils/errorHandler.util.js';
import { deleteFromCloudinary } from '../utils/cloudinary.util.js';
import { createZipArchive } from '../utils/archiver.util.js';
import fs from 'fs';
import path from 'path';

export const getUsers = asyncHandler(async (req, res) => {
  const { isActive, role, search } = req.query;
  const query = {};

  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  if (role) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .select('-passwordHash -__v')
    .sort({ createdAt: -1 });

  return sendSuccess(res, 200, users, 'Users retrieved successfully');
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-passwordHash -__v');

  if (!user) {
    throw new AppError('User not found', 404);
  }

  return sendSuccess(res, 200, user, 'User retrieved successfully');
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, isActive } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (role !== undefined) {
    if (!['user', 'admin'].includes(role)) {
      throw new AppError('Invalid role', 400);
    }
    user.role = role;
  }
  if (isActive !== undefined) user.isActive = isActive === 'true' || isActive === true;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.passwordHash;
  delete userResponse.__v;

  return sendSuccess(res, 200, userResponse, 'User updated successfully');
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = false;
  await user.save();

  return sendSuccess(res, 200, null, 'User deactivated successfully');
});

export const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  user.isActive = true;
  await user.save();

  const userResponse = user.toObject();
  delete userResponse.passwordHash;
  delete userResponse.__v;

  return sendSuccess(res, 200, userResponse, 'User activated successfully');
});

export const getStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const totalInactiveUsers = await User.countDocuments({ isActive: false });
  const totalMedia = await Media.countDocuments();
  const totalSharedMedia = await Media.countDocuments({ isShared: true });
  const totalContacts = await Contact.countDocuments();

  return sendSuccess(
    res,
    200,
    {
      users: {
        total: totalUsers,
        inactive: totalInactiveUsers,
      },
      media: {
        total: totalMedia,
        shared: totalSharedMedia,
      },
      contacts: {
        total: totalContacts,
      },
    },
    'Statistics retrieved successfully'
  );
});

export const getAllMedia = asyncHandler(async (req, res) => {
  const { search, tags, isShared, ownerId } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (tags) {
    const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
    query.tags = { $in: tagsArray.map((t) => t.trim()) };
  }

  if (isShared !== undefined) {
    query.isShared = isShared === 'true';
  }

  if (ownerId) {
    query.ownerId = ownerId;
  }

  const media = await Media.find(query)
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 })
    .select('-__v');

  return sendSuccess(res, 200, media, 'All media retrieved successfully');
});

export const deleteMediaAdmin = asyncHandler(async (req, res) => {
  const image = await Media.findById(req.params.id);

  if (!image) {
    throw new AppError('Media not found', 404);
  }

  if (image.url.startsWith('http')) {
    await deleteFromCloudinary(image.publicId);
  } else {
    const filePath = path.join('uploads', image.publicId);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  await Media.findByIdAndDelete(req.params.id);

  return sendSuccess(res, 200, null, 'Media deleted successfully');
});

export const downloadAllMediaZip = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  let query = {};

  if (ids && Array.isArray(ids) && ids.length > 0) {
    query = { _id: { $in: ids } };
  }

  const images = await Media.find(query);

  if (images.length === 0) {
    throw new AppError('No images found', 404);
  }

  const imageFiles = [];
  for (const img of images) {
    if (img.url.startsWith('http')) {
      imageFiles.push({
        url: img.url,
        name: img.title || img.publicId,
        isCloudinary: true,
      });
    } else {
      const filePath = path.join('uploads', img.publicId);
      if (fs.existsSync(filePath)) {
        imageFiles.push({
          path: filePath,
          name: img.title || img.publicId,
          isCloudinary: false,
        });
      }
    }
  }

  if (imageFiles.length === 0) {
    throw new AppError('No valid image files found', 404);
  }

  const zipPath = await createZipArchive(imageFiles);

  res.download(zipPath, 'all-images.zip', (err) => {
    if (err) {
      console.error('Download error:', err);
    }
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const activeUsers = await User.countDocuments({ isActive: true });
  const totalMedia = await Media.countDocuments();
  const sharedMedia = await Media.countDocuments({ isShared: true });

  // Uploads by day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const uploadsByDay = await Media.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top tags
  const topTags = await Media.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  return sendSuccess(
    res,
    200,
    {
      totalUsers,
      activeUsers,
      totalMedia,
      sharedMedia,
      uploadsByDay: uploadsByDay.map((item) => ({
        date: item._id,
        count: item.count,
      })),
      topTags: topTags.map((item) => ({
        tag: item._id,
        count: item.count,
      })),
    },
    'Analytics retrieved successfully'
  );
});

export const downloadAnalyticsReport = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({ isActive: true });
  const activeUsers = await User.countDocuments({ isActive: true });
  const totalMedia = await Media.countDocuments();
  const sharedMedia = await Media.countDocuments({ isShared: true });

  // Uploads by day (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const uploadsByDay = await Media.aggregate([
    {
      $match: {
        createdAt: { $gte: sevenDaysAgo },
      },
    },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top tags
  const topTags = await Media.aggregate([
    { $unwind: '$tags' },
    { $group: { _id: '$tags', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  const timestamp = new Date().toISOString();
  let report = 'MGMS Analytics Report\n';
  report += `Generated: ${timestamp}\n\n`;
  report += 'Users:\n';
  report += `- Total Users: ${totalUsers}\n`;
  report += `- Active Users: ${activeUsers}\n\n`;
  report += 'Media:\n';
  report += `- Total Uploads: ${totalMedia}\n`;
  report += `- Shared Uploads: ${sharedMedia}\n\n`;
  report += 'Uploads (Last 7 Days):\n';
  if (uploadsByDay.length === 0) {
    report += '- No uploads in the last 7 days\n';
  } else {
    uploadsByDay.forEach((item) => {
      report += `- ${item._id}: ${item.count}\n`;
    });
  }
  report += '\nTop Tags:\n';
  if (topTags.length === 0) {
    report += '- No tags found\n';
  } else {
    topTags.forEach((item) => {
      report += `- ${item._id} (${item.count})\n`;
    });
  }

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename=analytics-report.txt');
  res.send(report);
});