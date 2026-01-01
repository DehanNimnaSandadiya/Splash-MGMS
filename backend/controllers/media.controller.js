import Media from '../models/media.model.js';
import { createZipArchive } from '../utils/archiver.util.js';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getLocalFileUrl,
} from '../utils/cloudinary.util.js';
import { asyncHandler } from '../utils/errorHandler.util.js';
import { sendSuccess } from '../utils/response.util.js';
import { AppError } from '../utils/errorHandler.util.js';
import fs from 'fs';
import path from 'path';

export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const { title, description, tags, isShared } = req.body;
  let fileUrl, publicId;

  try {
    const cloudinaryResult = await uploadToCloudinary(req.file.path);
    if (cloudinaryResult) {
      fileUrl = cloudinaryResult.url;
      publicId = cloudinaryResult.publicId;
      fs.unlinkSync(req.file.path);
    } else {
      fileUrl = getLocalFileUrl(req.file.filename);
      publicId = req.file.filename;
    }
  } catch (error) {
    console.error('Upload error:', error);
    fileUrl = getLocalFileUrl(req.file.filename);
    publicId = req.file.filename;
  }

  let tagsArray = [];
  if (tags) {
    if (Array.isArray(tags)) {
      tagsArray = tags.map((t) => String(t).trim());
    } else {
      tagsArray = String(tags)
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
  }

  const media = new Media({
    ownerId: req.user.userId,
    isShared: isShared === 'true' || isShared === true,
    title: title || req.file.originalname,
    description: description || '',
    tags: tagsArray,
    url: fileUrl,
    publicId,
  });

  await media.save();

  return sendSuccess(
    res,
    201,
    {
      id: media._id,
      title: media.title,
      description: media.description,
      tags: media.tags,
      url: media.url,
      isShared: media.isShared,
      createdAt: media.createdAt,
    },
    'Image uploaded successfully'
  );
});

export const getImages = asyncHandler(async (req, res) => {
  const { isShared, tags, search, personal } = req.query;
  const scopeQuery = {};

  if (personal === 'true' || personal === true) {
    scopeQuery.ownerId = req.user.userId;
    scopeQuery.isShared = false;
  } else if (isShared === 'true' || isShared === true) {
    scopeQuery.isShared = true;
  } else {
    scopeQuery.$or = [
      { ownerId: req.user.userId },
      { isShared: true },
    ];
  }

  const query = { ...scopeQuery };

  if (tags) {
    const tagArray = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());
    query.tags = { $in: tagArray };
  }

  if (search) {
    const searchConditions = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ],
    };

    if (scopeQuery.$or) {
      const andConditions = [{ $or: scopeQuery.$or }, searchConditions];
      if (query.tags) {
        andConditions.push({ tags: query.tags });
        delete query.tags;
      }
      query.$and = andConditions;
      delete query.$or;
    } else {
      query.$or = searchConditions.$or;
    }
  }

  const images = await Media.find(query)
    .populate('ownerId', 'name email')
    .sort({ createdAt: -1 })
    .limit(100)
    .select('-__v');

  return sendSuccess(res, 200, images, 'Images retrieved successfully');
});

export const getImageById = asyncHandler(async (req, res) => {
  const image = await Media.findById(req.params.id).populate('ownerId', 'name email');

  if (!image) {
    throw new AppError('Image not found', 404);
  }

  if (
    image.ownerId._id.toString() !== req.user.userId &&
    !image.isShared &&
    req.user.role !== 'admin'
  ) {
    throw new AppError('Unauthorized to access this image', 403);
  }

  return sendSuccess(res, 200, image, 'Image retrieved successfully');
});

export const updateImage = asyncHandler(async (req, res) => {
  const { title, description, tags, isShared } = req.body;
  const image = await Media.findById(req.params.id);

  if (!image) {
    throw new AppError('Image not found', 404);
  }

  if (image.ownerId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('Unauthorized to update this image', 403);
  }

  if (title !== undefined) image.title = title;
  if (description !== undefined) image.description = description;
  if (tags !== undefined) {
    if (Array.isArray(tags)) {
      image.tags = tags.map((t) => String(t).trim()).filter((t) => t.length > 0);
    } else {
      image.tags = String(tags)
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }
  }
  if (isShared !== undefined) image.isShared = isShared === 'true' || isShared === true;

  image.updatedAt = Date.now();
  await image.save();

  return sendSuccess(res, 200, image, 'Image updated successfully');
});

export const deleteImage = asyncHandler(async (req, res) => {
  const image = await Media.findById(req.params.id);

  if (!image) {
    throw new AppError('Image not found', 404);
  }

  if (image.ownerId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('Unauthorized to delete this image', 403);
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

  return sendSuccess(res, 200, null, 'Image deleted successfully');
});

export const deleteMultipleImages = asyncHandler(async (req, res) => {
  const { imageIds } = req.body;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    throw new AppError('Please provide image IDs array', 400);
  }

  const images = await Media.find({
    _id: { $in: imageIds },
  });

  if (images.length === 0) {
    throw new AppError('No images found', 404);
  }

  const deletableImages = images.filter((image) => {
    return (
      image.ownerId.toString() === req.user.userId || req.user.role === 'admin'
    );
  });

  if (deletableImages.length === 0) {
    throw new AppError(
      'You do not have permission to delete any of the selected images',
      403
    );
  }

  for (const image of deletableImages) {
    if (image.url.startsWith('http')) {
      await deleteFromCloudinary(image.publicId);
    } else {
      const filePath = path.join('uploads', image.publicId);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  const deletableIds = deletableImages.map((img) => img._id);
  await Media.deleteMany({
    _id: { $in: deletableIds },
  });

  return sendSuccess(
    res,
    200,
    { deletedCount: deletableImages.length },
    `${deletableImages.length} image(s) deleted successfully`
  );
});

export const downloadZip = asyncHandler(async (req, res) => {
  const { imageIds } = req.body;

  if (!imageIds || !Array.isArray(imageIds) || imageIds.length === 0) {
    throw new AppError('Please provide image IDs array', 400);
  }

  const query = {
    _id: { $in: imageIds },
  };

  if (req.user.role !== 'admin') {
    query.ownerId = req.user.userId;
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

  res.download(zipPath, 'images.zip', (err) => {
    if (err) {
      console.error('Download error:', err);
    }
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
  });
});
