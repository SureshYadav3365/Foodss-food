import multer from 'multer';
import cloudinary from '../config/cloudinary.js';

// Setup multer memory storage to process uploads in-memory
const storage = multer.memoryStorage();

// File filter to restrict uploads to image mime-types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer upload middleware instance
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB limit
  fileFilter,
});

/**
 * Utility function to upload a buffer to Cloudinary using stream.
 * @param {Buffer} fileBuffer - The memory buffer of the uploaded file
 * @param {string} folder - Destination folder on Cloudinary
 * @returns {Promise<object>} Cloudinary upload result
 */
export const uploadToCloudinary = (fileBuffer, folder = 'food-delivery') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};
