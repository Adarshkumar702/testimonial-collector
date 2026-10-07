const analyticsService = require('../services/analytics.service');

class AnalyticsController {
  async getSpaceAnalytics(req, res, next) {
    try {
      const { spaceId } = req.params;
      const analytics = await analyticsService.getSpaceAnalytics(req.user._id, spaceId);

      res.status(200).json({
        success: true,
        data: analytics
      });
    } catch (error) {
      next(error);
    }
  }

  async getOverviewAnalytics(req, res, next) {
    try {
      const overview = await analyticsService.getOwnerOverviewAnalytics(req.user._id);

      res.status(200).json({
        success: true,
        data: overview
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AnalyticsController();
