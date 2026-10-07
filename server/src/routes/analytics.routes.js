const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

router.get('/overview', (req, res, next) => analyticsController.getOverviewAnalytics(req, res, next));
router.get('/space/:spaceId', (req, res, next) => analyticsController.getSpaceAnalytics(req, res, next));

module.exports = router;
