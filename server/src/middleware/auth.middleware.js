const { verifyAccessToken } = require('../utils/jwt');
const User = require('../models/User');
const { AppError } = require('./error.middleware');

const authenticate = async (req, res, next) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Authentication required. Access token missing.', 401));
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return next(new AppError('Token expired or invalid.', 401));
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User belonging to this token no longer exists.', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403));
    }
    next();
  };
};

module.exports = {
  authenticate,
  authorize
};
