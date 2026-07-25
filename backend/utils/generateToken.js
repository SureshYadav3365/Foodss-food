import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  });
};

export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'food_delivery_refresh_secret_key_2024', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

export const generateToken = (userId) => {
  return generateAccessToken(userId);
};
