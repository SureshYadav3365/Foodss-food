import Notification from '../models/Notification.js';
import { ApiResponse, ApiError } from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Retrieve notifications for the authenticated user
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, notifications));
});

// Mark a single notification as read
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, 'Notification not found');
  }

  res.json(new ApiResponse(200, notification, 'Notification marked as read'));
});

// Mark all user notifications as read
export const markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(new ApiResponse(200, notifications, 'All notifications marked as read'));
});

/**
 * Helper function to create database notifications and push real-time socket events.
 * Can be called internally from other controllers.
 */
export const createDBNotification = async (app, userId, title, message, type = 'system') => {
  try {
    const notification = await Notification.create({
      user: userId,
      title,
      message,
      type,
    });

    const io = app.get('io');
    if (io) {
      // Emit to user's personalized channel
      io.to(`user_${userId.toString()}`).emit('newNotification', notification);
    }
    return notification;
  } catch (error) {
    console.error('Error creating database notification:', error);
  }
};
