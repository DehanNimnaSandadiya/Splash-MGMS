import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /\.(jpg|jpeg|png)$/i;
  const allowedMimeTypes = /^image\/(jpeg|jpg|png)$/;

  const isValidExtension = allowedExtensions.test(file.originalname);
  const isValidMimeType = allowedMimeTypes.test(file.mimetype);

  if (isValidExtension && isValidMimeType) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG and PNG images are allowed (max 5MB)'));
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
});

