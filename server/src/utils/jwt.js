const jwt = require('jsonwebtoken');
const env = require('../config/env');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role || 'OWNER' },
    env.jwtAccessSecret,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user, tokenId) => {
  return jwt.sign(
    { id: user._id, tokenId },
    env.jwtRefreshSecret,
    { expiresIn: '7d' }
  );
};

const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, env.jwtAccessSecret);
  } catch (error) {
    return null;
  }
};

const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, env.jwtRefreshSecret);
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
};
