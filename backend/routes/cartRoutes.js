import { Router } from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// Apply auth protection to all cart routes
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/remove/:foodId', removeFromCart);
router.delete('/clear', clearCart);

export default router;
