const authService = require('../services/auth.service');
const { setAuthCookies, clearAuthCookies, REFRESH_TOKEN_COOKIE_NAME } = require('../utils/cookies');

class AuthController {
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.signup({ name, email, password });

      res.status(201).json({
        success: true,
        message: 'Registration successful! Verification token generated (simulation).',
        data: {
          user: result.user,
          simulationVerificationUrl: result.simulationVerificationUrl,
          verificationToken: result.verificationToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async verifyEmail(req, res, next) {
    try {
      const { token, email } = req.body;
      const user = await authService.verifyEmail({ token, email });

      res.status(200).json({
        success: true,
        message: 'Email verified successfully! You can now log in.',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.login({ email, password });

      // Set BOTH accessToken (15m) and refreshToken (7d) in httpOnly cookies
      setAuthCookies(res, accessToken, refreshToken);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      // Strictly read refresh token ONLY from httpOnly cookie (no request body fallback)
      const refreshToken = req.cookies ? req.cookies[REFRESH_TOKEN_COOKIE_NAME] : undefined;
      const { user, accessToken, refreshToken: newRefreshToken } = await authService.refreshTokens(refreshToken);

      // Rotate BOTH tokens and set as new httpOnly cookies
      setAuthCookies(res, accessToken, newRefreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          user
        }
      });
    } catch (error) {
      clearAuthCookies(res);
      next(error);
    }
  }

  async logout(req, res, next) {
    try {
      // Strictly read refresh token ONLY from httpOnly cookie (no request body fallback)
      const refreshToken = req.cookies ? req.cookies[REFRESH_TOKEN_COOKIE_NAME] : undefined;
      await authService.logout(refreshToken);

      clearAuthCookies(res);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      clearAuthCookies(res);
      next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword({ email });

      res.status(200).json({
        success: true,
        message: result.message,
        data: {
          simulationResetUrl: result.simulationResetUrl,
          resetToken: result.resetToken
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      const user = await authService.resetPassword({ token, newPassword });

      clearAuthCookies(res);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully! Please log in with your new password.',
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }

  async getCurrentUser(req, res, next) {
    try {
      res.status(200).json({
        success: true,
        data: { user: req.user }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
