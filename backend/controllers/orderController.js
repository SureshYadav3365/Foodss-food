import Order from '../models/Order.js';
import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';
import Coupon from '../models/Coupon.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { createDBNotification } from './notificationController.js';
import { ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, paymentMethod, couponCode, notes } = req.body;

  if (!items?.length) throw new ApiError(400, 'Order must have at least one item');

  const foodIds = items.map((i) => i.food);
  const foods = await Food.find({ _id: { $in: foodIds } }).populate('restaurant');
  if (foods.length !== items.length) throw new ApiError(400, 'Some food items not found');

  const restaurantIds = [...new Set(foods.map((f) => f.restaurant._id.toString()))];
  if (restaurantIds.length > 1) {
    throw new ApiError(400, 'All items must be from the same restaurant');
  }

  const restaurant = foods[0].restaurant;
  const orderItems = items.map((item) => {
    const food = foods.find((f) => f._id.toString() === item.food);
    return {
      food: food._id,
      name: food.name,
      price: food.discountPrice || food.price,
      quantity: item.quantity,
      image: food.image,
    };
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  let discount = 0;
  let appliedCoupon = '';

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (!coupon) throw new ApiError(400, 'Invalid coupon code');
    if (coupon.expiryDate < new Date()) throw new ApiError(400, 'Coupon expired');
    if (coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit reached');
    if (subtotal < coupon.minOrder) throw new ApiError(400, `Minimum order of ₹${coupon.minOrder} required`);

    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else {
      discount = coupon.discountValue;
    }

    coupon.usedCount += 1;
    await coupon.save();
    appliedCoupon = coupon.code;
  }

  const deliveryFee = subtotal >= restaurant.minOrder ? restaurant.deliveryFee : restaurant.deliveryFee;
  const total = subtotal + deliveryFee - discount;

  const estimatedDelivery = new Date(Date.now() + 45 * 60 * 1000);

  const order = await Order.create({
    user: req.user._id,
    restaurant: restaurant._id,
    items: orderItems,
    subtotal,
    deliveryFee,
    discount,
    couponCode: appliedCoupon,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    deliveryAddress,
    estimatedDelivery,
    notes,
  });

  const populated = await Order.findById(order._id)
    .populate('restaurant', 'name image')
    .populate('user', 'name email phone');

  // Trigger DB & Real-time notification updates
  await createDBNotification(
    req.app,
    req.user._id,
    'Order Placed Successfully',
    `Your order at ${restaurant.name} has been placed. Amount: ₹${total.toFixed(2)}.`,
    'order'
  );

  if (restaurant.owner) {
    await createDBNotification(
      req.app,
      restaurant.owner,
      'New Order Received',
      `You have received a new order for ₹${total.toFixed(2)}.`,
      'order'
    );
  }

  res.status(201).json(new ApiResponse(201, populated, 'Order placed successfully'));
});

export const getOrders = asyncHandler(async (req, res) => {
  const query = {};

  if (req.user.role === 'user') {
    query.user = req.user._id;
  } else if (req.user.role === 'restaurant') {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (restaurant) query.restaurant = restaurant._id;
  }

  const orders = await Order.find(query)
    .populate('restaurant', 'name image')
    .populate('user', 'name email phone')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, orders));
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('restaurant', 'name image address phone')
    .populate('user', 'name email phone')
    .populate('items.food', 'name image');

  if (!order) throw new ApiError(404, 'Order not found');

  if (req.user.role === 'user' && order.user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized');
  }

  res.json(new ApiResponse(200, order));
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;
  const order = await Order.findById(req.params.id).populate('restaurant');

  if (!order) throw new ApiError(404, 'Order not found');

  if (req.user.role === 'restaurant') {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant || order.restaurant._id.toString() !== restaurant._id.toString()) {
      throw new ApiError(403, 'Not authorized');
    }
  }

  order.status = status;
  order.statusHistory.push({ status, timestamp: new Date(), note: note || `Order ${status}` });
  await order.save();

  const io = req.app.get('io');
  if (io) {
    io.to(order._id.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status,
      statusHistory: order.statusHistory,
      estimatedDelivery: order.estimatedDelivery,
    });
  }

  // Trigger DB & Real-time notification update for status changes
  await createDBNotification(
    req.app,
    order.user._id,
    `Order Status: ${status.toUpperCase()}`,
    `Your order from ${order.restaurant.name} is now ${status}.`,
    'order'
  );

  res.json(new ApiResponse(200, order, 'Order status updated'));
});

export const getOrderStats = asyncHandler(async (req, res) => {
  let matchQuery = {};
  if (req.user.role === 'restaurant') {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (restaurant) matchQuery.restaurant = restaurant._id;
  }

  const stats = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        revenue: { $sum: '$total' },
      },
    },
  ]);

  const totalOrders = await Order.countDocuments(matchQuery);
  const totalRevenue = await Order.aggregate([
    { $match: { ...matchQuery, status: { $ne: 'cancelled' } } },
    { $group: { _id: null, total: { $sum: '$total' } } },
  ]);

  res.json(new ApiResponse(200, {
    stats,
    totalOrders,
    totalRevenue: totalRevenue[0]?.total || 0,
  }));
});

export const payOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('restaurant');

  if (!order) {
    throw new ApiError(404, 'Order not found');
  }

  if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized');
  }

  order.paymentStatus = 'paid';
  order.status = 'confirmed';
  order.statusHistory.push({ status: 'confirmed', timestamp: new Date(), note: 'Payment processed successfully' });
  await order.save();

  // Create notifications
  await createDBNotification(
    req.app,
    order.user,
    'Payment Successful',
    `Payment for your order at ${order.restaurant.name} was successful. Order confirmed.`,
    'order'
  );

  if (order.restaurant.owner) {
    await createDBNotification(
      req.app,
      order.restaurant.owner,
      'Order Confirmed (Paid)',
      `Order for ₹${order.total.toFixed(2)} has been paid and confirmed.`,
      'order'
    );
  }

  const io = req.app.get('io');
  if (io) {
    io.to(order._id.toString()).emit('orderStatusUpdated', {
      orderId: order._id,
      status: order.status,
      statusHistory: order.statusHistory,
      estimatedDelivery: order.estimatedDelivery,
    });
  }

  res.json(new ApiResponse(200, order, 'Payment processed successfully'));
});
