const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/signup', (req, res, next) => authController.signup(req, res, next));
router.post('/verify-email', (req, res, next) => authController.verifyEmail(req, res, next));
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));
router.post('/logout', (req, res, next) => authController.logout(req, res, next));
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));
router.get('/me', authenticate, (req, res, next) => authController.getCurrentUser(req, res, next));

module.exports = router;
