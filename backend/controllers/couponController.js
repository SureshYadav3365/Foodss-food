import Coupon from '../models/Coupon.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

export const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort({ createdAt: -1 });
  res.json(new ApiResponse(200, coupons));
});

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;
  const { orderAmount } = req.query;

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
  if (!coupon) throw new ApiError(404, 'Invalid coupon code');
  if (coupon.expiryDate < new Date()) throw new ApiError(400, 'Coupon has expired');
  if (coupon.usedCount >= coupon.usageLimit) throw new ApiError(400, 'Coupon usage limit reached');
  if (orderAmount && parseFloat(orderAmount) < coupon.minOrder) {
    throw new ApiError(400, `Minimum order of ₹${coupon.minOrder} required`);
  }

  let discount = 0;
  const amount = parseFloat(orderAmount) || 0;
  if (coupon.discountType === 'percentage') {
    discount = (amount * coupon.discountValue) / 100;
    if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
  } else {
    discount = coupon.discountValue;
  }

  res.json(new ApiResponse(200, { coupon, discount }));
});

export const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json(new ApiResponse(201, coupon, 'Coupon created'));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, coupon, 'Coupon updated'));
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) throw new ApiError(404, 'Coupon not found');
  res.json(new ApiResponse(200, null, 'Coupon deleted'));
});
