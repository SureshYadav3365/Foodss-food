import Cart from '../models/Cart.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Get user's cart
export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate({
    path: 'items.food',
    populate: { path: 'restaurant', select: 'name deliveryFee minOrder image' },
  });

  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  res.json(new ApiResponse(200, cart));
});

// Add item to cart
export const addToCart = asyncHandler(async (req, res) => {
  const { foodId, quantity = 1 } = req.body;

  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.food.toString() === foodId.toString()
  );

  if (existingItemIndex > -1) {
    cart.items[existingItemIndex].quantity += quantity;
  } else {
    cart.items.push({ food: foodId, quantity });
  }

  await cart.save();

  await cart.populate({
    path: 'items.food',
    populate: { path: 'restaurant', select: 'name deliveryFee minOrder image' },
  });

  res.json(new ApiResponse(200, cart, 'Item added to cart'));
});

// Update item quantity in cart
export const updateCartItem = asyncHandler(async (req, res) => {
  const { foodId, quantity } = req.body;

  if (quantity < 1) {
    throw new ApiError(400, 'Quantity must be at least 1');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.food.toString() === foodId.toString()
  );

  if (itemIndex === -1) {
    throw new ApiError(404, 'Item not found in cart');
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  await cart.populate({
    path: 'items.food',
    populate: { path: 'restaurant', select: 'name deliveryFee minOrder image' },
  });

  res.json(new ApiResponse(200, cart, 'Cart updated'));
});

// Remove item from cart
export const removeFromCart = asyncHandler(async (req, res) => {
  const { foodId } = req.params;

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    throw new ApiError(404, 'Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.food.toString() !== foodId.toString()
  );
  await cart.save();

  await cart.populate({
    path: 'items.food',
    populate: { path: 'restaurant', select: 'name deliveryFee minOrder image' },
  });

  res.json(new ApiResponse(200, cart, 'Item removed from cart'));
});

// Clear cart
export const clearCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id });
  if (!cart) {
    cart = await Cart.create({ user: req.user._id, items: [] });
  } else {
    cart.items = [];
    await cart.save();
  }

  res.json(new ApiResponse(200, cart, 'Cart cleared'));
});
