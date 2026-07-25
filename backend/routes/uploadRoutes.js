import { Router } from 'express';
import { uploadImage } from '../controllers/uploadController.js';
import { upload } from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Endpoint for file uploading. Accepts form field name 'image'
router.post('/', protect, upload.single('image'), uploadImage);

export default router;
