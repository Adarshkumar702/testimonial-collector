const mongoose = require('mongoose');
const Testimonial = require('../models/Testimonial');
const Space = require('../models/Space');
const { AppError } = require('../middleware/error.middleware');

class AnalyticsService {
  async getSpaceAnalytics(ownerId, spaceId) {
    const space = await Space.findOne({ _id: spaceId, owner: ownerId });
    if (!space) {
      throw new AppError('Space not found or unauthorized', 404);
    }

    const spaceObjectId = new mongoose.Types.ObjectId(spaceId);

    // Aggregation for rating breakdown and metrics
    const statsAggregation = await Testimonial.aggregate([
      { $match: { space: spaceObjectId } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          fiveStarCount: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
          fourStarCount: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
          threeStarCount: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
          twoStarCount: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
          oneStarCount: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
          approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
          pendingCount: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          rejectedCount: { $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] } },
          archivedCount: { $sum: { $cond: [{ $eq: ['$status', 'archived'] }, 1, 0] } },
          featuredCount: { $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] } },
          likedCount: { $sum: { $cond: [{ $eq: ['$liked', true] }, 1, 0] } }
        }
      }
    ]);

    const result = statsAggregation[0] || {
      totalReviews: 0,
      averageRating: 0,
      fiveStarCount: 0,
      fourStarCount: 0,
      threeStarCount: 0,
      twoStarCount: 0,
      oneStarCount: 0,
      approvedCount: 0,
      pendingCount: 0,
      rejectedCount: 0,
      archivedCount: 0,
      featuredCount: 0,
      likedCount: 0
    };

    const totalReviews = result.totalReviews;
    const avgRating = totalReviews > 0 ? parseFloat(result.averageRating.toFixed(1)) : 0;
    const approvalRate = totalReviews > 0 ? Math.round((result.approvedCount / totalReviews) * 100) : 0;

    return {
      space: {
        id: space._id,
        name: space.name,
        slug: space.slug
      },
      metrics: {
        averageRating: avgRating,
        totalReviews,
        approvalRate,
        featuredCount: result.featuredCount,
        likedCount: result.likedCount
      },
      ratingDistribution: {
        5: result.fiveStarCount,
        4: result.fourStarCount,
        3: result.threeStarCount,
        2: result.twoStarCount,
        1: result.oneStarCount
      },
      statusDistribution: {
        pending: result.pendingCount,
        approved: result.approvedCount,
        rejected: result.rejectedCount,
        archived: result.archivedCount
      }
    };
  }

  async getOwnerOverviewAnalytics(ownerId) {
    const spaces = await Space.find({ owner: ownerId });
    const spaceIds = spaces.map(s => s._id);

    if (spaceIds.length === 0) {
      return {
        totalSpaces: 0,
        totalTestimonials: 0,
        pendingTestimonials: 0,
        approvedTestimonials: 0,
        averageRating: 0
      };
    }

    const statsAggregation = await Testimonial.aggregate([
      { $match: { space: { $in: spaceIds } } },
      {
        $group: {
          _id: null,
          totalTestimonials: { $sum: 1 },
          averageRating: { $avg: '$rating' },
          pendingTestimonials: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
          approvedTestimonials: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } }
        }
      }
    ]);

    const result = statsAggregation[0] || {
      totalTestimonials: 0,
      averageRating: 0,
      pendingTestimonials: 0,
      approvedTestimonials: 0
    };

    return {
      totalSpaces: spaces.length,
      totalTestimonials: result.totalTestimonials,
      pendingTestimonials: result.pendingTestimonials,
      approvedTestimonials: result.approvedTestimonials,
      averageRating: result.totalTestimonials > 0 ? parseFloat(result.averageRating.toFixed(1)) : 0
    };
  }
}

module.exports = new AnalyticsService();
