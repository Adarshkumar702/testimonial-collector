const env = require('../config/env');

const ACCESS_TOKEN_COOKIE_NAME = 'accessToken';
const REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  maxAge,
  path: '/'
});

const setAuthCookies = (res, accessToken, refreshToken) => {
  if (accessToken) {
    res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, getCookieOptions(ACCESS_TOKEN_MAX_AGE));
  }
  if (refreshToken) {
    res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, getCookieOptions(REFRESH_TOKEN_MAX_AGE));
  }
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_TOKEN_COOKIE_NAME, {
    ...getCookieOptions(0),
    maxAge: 0
  });
  res.clearCookie(REFRESH_TOKEN_COOKIE_NAME, {
    ...getCookieOptions(0),
    maxAge: 0
  });
};

module.exports = {
  ACCESS_TOKEN_COOKIE_NAME,
  REFRESH_TOKEN_COOKIE_NAME,
  setAuthCookies,
  clearAuthCookies
};
