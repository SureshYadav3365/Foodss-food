import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { uploadToCloudinary } from '../middleware/upload.js';

/**
 * Handle uploading an image file and return the Cloudinary URL.
 */
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'Please upload an image file');
  }

  try {
    // Determine folder based on entity query param (e.g., /api/upload?folder=foods)
    const folder = req.query.folder || 'general';
    const result = await uploadToCloudinary(req.file.buffer, `food-delivery/${folder}`);

    res.status(200).json(
      new ApiResponse(
        200,
        {
          url: result.secure_url,
          public_id: result.public_id,
        },
        'Image uploaded successfully'
      )
    );
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new ApiError(500, 'Failed to upload image to storage provider');
  }
});
