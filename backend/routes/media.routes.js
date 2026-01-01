import express from 'express';
import {
  uploadImage,
  getImages,
  getImageById,
  updateImage,
  deleteImage,
  deleteMultipleImages,
  downloadZip,
} from '../controllers/media.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getImages);
router.post('/upload', upload.single('image'), uploadImage);
router.get('/:id', getImageById);
router.put('/:id', updateImage);
router.delete('/:id', deleteImage);
router.delete('/multiple', deleteMultipleImages);
router.post('/download-zip', downloadZip);

export default router;
