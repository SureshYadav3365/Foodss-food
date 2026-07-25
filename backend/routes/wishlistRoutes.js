import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getWishlist);
router.post('/:foodId', protect, addToWishlist);
router.delete('/:foodId', protect, removeFromWishlist);

export default router;
