import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already registered');
  }

  const allowedRoles = ['user', 'restaurant'];
  const userRole = allowedRoles.includes(role) ? role : 'user';

  const user = await User.create({ name, email, password, role: userRole, phone });
  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.status(201).json(
    new ApiResponse(201, {
      user: { _id: user._id, name: user.name, email: user.email, role: user.role, phone: user.phone },
      token,
      refreshToken,
    }, 'Registration successful')
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json(
    new ApiResponse(200, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses,
      },
      token,
      refreshToken,
    }, 'Login successful')
  );
});

export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken: clientRefreshToken } = req.body;

  if (!clientRefreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  try {
    const decoded = jwt.verify(
      clientRefreshToken,
      process.env.JWT_REFRESH_SECRET || 'food_delivery_refresh_secret_key_2024'
    );

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    const newAccessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.json(
      new ApiResponse(200, {
        token: newAccessToken,
        refreshToken: newRefreshToken,
      }, 'Token refreshed successfully')
    );
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired refresh token');
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, 'There is no user with that email');
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire to 10 mins
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save({ validateBeforeSave: false });

  // Create reset url pointing to frontend path
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

  const message = `
    <h1>You have requested a password reset</h1>
    <p>Please go to this link to reset your password:</p>
    <a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
    <p>If you did not request this, please ignore this email.</p>
  `;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset Request',
      html: message,
    });

    res.json(new ApiResponse(200, null, 'Email sent'));
  } catch (err) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    throw new ApiError(500, 'Email could not be sent');
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, 'Invalid or expired token');
  }

  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  res.json(
    new ApiResponse(200, {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        addresses: user.addresses,
      },
      token,
      refreshToken,
    }, 'Password reset successful')
  );
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(new ApiResponse(200, user));
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, avatar } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, phone, avatar },
    { new: true, runValidators: true }
  );
  res.json(new ApiResponse(200, user, 'Profile updated'));
});

export const updateAddresses = asyncHandler(async (req, res) => {
  const { addresses } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { addresses },
    { new: true, runValidators: true }
  );
  res.json(new ApiResponse(200, user.addresses, 'Addresses updated'));
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json(new ApiResponse(200, users));
});
