import { Router } from 'express';
import { getCoupons, validateCoupon, createCoupon, updateCoupon, deleteCoupon } from '../controllers/couponController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, authorize('admin'), getCoupons);
router.get('/validate/:code', protect, validateCoupon);
router.post('/', protect, authorize('admin'), createCoupon);
router.put('/:id', protect, authorize('admin'), updateCoupon);
router.delete('/:id', protect, authorize('admin'), deleteCoupon);

export default router;
