const crypto = require('crypto');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../utils/jwt');
const { AppError } = require('../middleware/error.middleware');
const { isValidEmail } = require('../utils/validators');

class AuthService {
  async signup({ name, email, password }) {
    if (!name || !email || !password) {
      throw new AppError('Name, email, and password are required', 400);
    }

    if (!isValidEmail(email)) {
      throw new AppError('Please provide a valid email address', 400);
    }

    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      throw new AppError('User with this email already exists', 409);
    }

    const hashedPassword = await hashPassword(password);
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      isVerified: false,
      verificationToken,
      verificationTokenExpires
    });

    return {
      user,
      simulationVerificationUrl: `/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`,
      verificationToken
    };
  }

  async verifyEmail({ token, email }) {
    if (!token) {
      throw new AppError('Verification token is required', 400);
    }

    const query = { verificationToken: token };
    if (email) query.email = email.toLowerCase().trim();

    const user = await User.findOne(query);

    if (!user) {
      throw new AppError('Invalid or expired verification token', 400);
    }

    if (user.verificationTokenExpires && user.verificationTokenExpires < new Date()) {
      throw new AppError('Verification token has expired. Please request a new one.', 400);
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    return user;
  }

  async login({ email, password }) {
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new AppError('Invalid email or password', 401);
    }

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshTokenString = generateRefreshToken(user, crypto.randomBytes(16).toString('hex'));

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await RefreshToken.create({
      user: user._id,
      token: refreshTokenString,
      expiresAt
    });

    return {
      user,
      accessToken,
      refreshToken: refreshTokenString
    };
  }

  async refreshTokens(refreshTokenString) {
    if (!refreshTokenString) {
      throw new AppError('Refresh token required', 401);
    }

    const decoded = verifyRefreshToken(refreshTokenString);
    if (!decoded) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const existingTokenDoc = await RefreshToken.findOne({ token: refreshTokenString });

    if (!existingTokenDoc || existingTokenDoc.isRevoked) {
      // Security measure: Token reuse detected or invalid token. Revoke all tokens for user.
      if (existingTokenDoc) {
        await RefreshToken.updateMany({ user: existingTokenDoc.user }, { isRevoked: true });
      }
      throw new AppError('Refresh token has been revoked or is invalid', 401);
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('User not found', 401);
    }

    // Refresh Token Rotation: Revoke current token, issue new pair
    existingTokenDoc.isRevoked = true;
    const newRefreshTokenString = generateRefreshToken(user, crypto.randomBytes(16).toString('hex'));
    existingTokenDoc.replacedByToken = newRefreshTokenString;
    await existingTokenDoc.save();

    const newAccessToken = generateAccessToken(user);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await RefreshToken.create({
      user: user._id,
      token: newRefreshTokenString,
      expiresAt
    });

    return {
      user,
      accessToken: newAccessToken,
      refreshToken: newRefreshTokenString
    };
  }

  async logout(refreshTokenString) {
    if (refreshTokenString) {
      await RefreshToken.findOneAndUpdate(
        { token: refreshTokenString },
        { isRevoked: true }
      );
    }
  }

  async forgotPassword({ email }) {
    if (!email || !isValidEmail(email)) {
      throw new AppError('Please provide a valid email address', 400);
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Return simulation message even if user not found for security
      return {
        message: 'If an account with that email exists, password reset instructions have been created.',
        simulationResetUrl: null
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    return {
      message: 'Password reset link created (Simulation Mode).',
      simulationResetUrl: `/reset-password?token=${resetToken}`,
      resetToken
    };
  }

  async resetPassword({ token, newPassword }) {
    if (!token || !newPassword) {
      throw new AppError('Reset token and new password are required', 400);
    }

    if (newPassword.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }
    });

    if (!user) {
      throw new AppError('Password reset token is invalid or has expired', 400);
    }

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    // Revoke all existing refresh tokens for security
    await RefreshToken.updateMany({ user: user._id }, { isRevoked: true });

    return user;
  }
}

module.exports = new AuthService();
