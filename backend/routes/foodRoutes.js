import { Router } from 'express';
import { getFoods, getFood, createFood, updateFood, deleteFood } from '../controllers/foodController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getFoods);
router.get('/:id', getFood);
router.post('/', protect, authorize('admin', 'restaurant'), createFood);
router.put('/:id', protect, authorize('admin', 'restaurant'), updateFood);
router.delete('/:id', protect, authorize('admin', 'restaurant'), deleteFood);

export default router;
