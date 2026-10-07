const Testimonial = require('../models/Testimonial');
const Space = require('../models/Space');
const { AppError } = require('../middleware/error.middleware');
const { isValidEmail } = require('../utils/validators');
const uploadService = require('./upload.service');

class TestimonialService {
  async submitPublicTestimonial(spaceSlug, data, avatarFile) {
    const space = await Space.findOne({ slug: spaceSlug.toLowerCase(), isActive: true });
    if (!space) {
      throw new AppError('Space not found or unavailable for submissions', 404);
    }

    const { customerName, customerEmail, companyRole, rating, reviewText, customAnswers } = data;

    if (!customerName || !customerName.trim()) {
      throw new AppError('Customer name is required', 400);
    }

    if (!customerEmail || !isValidEmail(customerEmail)) {
      throw new AppError('A valid customer email is required', 400);
    }

    if (!reviewText || !reviewText.trim()) {
      throw new AppError('Review text is required', 400);
    }

    let parsedRating = parseInt(rating, 10);
    if (space.requireRating) {
      if (isNaN(parsedRating) || parsedRating < 1 || parsedRating > 5) {
        throw new AppError('A valid rating between 1 and 5 stars is required', 400);
      }
    } else {
      if (isNaN(parsedRating)) parsedRating = 5;
    }

    if (space.requireAvatar && !avatarFile) {
      throw new AppError('An avatar image upload is required by this Space', 400);
    }

    let parsedCustomAnswers = [];
    if (customAnswers) {
      try {
        parsedCustomAnswers = typeof customAnswers === 'string' ? JSON.parse(customAnswers) : customAnswers;
      } catch (e) {
        parsedCustomAnswers = [];
      }
    }

    let avatar = null;
    if (avatarFile) {
      avatar = avatarFile.filename;
    }

    const testimonial = await Testimonial.create({
      space: space._id,
      customerName: customerName.trim(),
      customerEmail: customerEmail.toLowerCase().trim(),
      companyRole: companyRole ? companyRole.trim() : '',
      rating: parsedRating,
      reviewText: reviewText.trim(),
      avatar,
      customAnswers: parsedCustomAnswers,
      status: 'pending',
      featured: false,
      liked: false
    });

    return testimonial;
  }

  async getSpaceTestimonials(ownerId, spaceId, query = {}) {
    const space = await Space.findOne({ _id: spaceId, owner: ownerId });
    if (!space) {
      throw new AppError('Space not found or unauthorized', 404);
    }

    const { search, rating, status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = query;

    const filter = { space: spaceId };

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (rating && rating !== 'all') {
      filter.rating = parseInt(rating, 10);
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { customerName: searchRegex },
        { customerEmail: searchRegex },
        { companyRole: searchRegex },
        { reviewText: searchRegex }
      ];
    }

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const skip = (pageNum - 1) * limitNum;

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    const testimonials = await Testimonial.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Testimonial.countDocuments(filter);

    return {
      testimonials,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    };
  }

  async updateTestimonialStatus(ownerId, testimonialId, newStatus) {
    const validStatuses = ['approved', 'rejected', 'archived', 'pending'];
    if (!validStatuses.includes(newStatus)) {
      throw new AppError(`Invalid status. Must be one of: ${validStatuses.join(', ')}`, 400);
    }

    const testimonial = await Testimonial.findById(testimonialId).populate('space');
    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    if (testimonial.space.owner.toString() !== ownerId.toString()) {
      throw new AppError('Unauthorized to modify this testimonial', 403);
    }

    testimonial.status = newStatus;
    await testimonial.save();
    return testimonial;
  }

  async toggleFeatured(ownerId, testimonialId) {
    const testimonial = await Testimonial.findById(testimonialId).populate('space');
    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    if (testimonial.space.owner.toString() !== ownerId.toString()) {
      throw new AppError('Unauthorized to modify this testimonial', 403);
    }

    testimonial.featured = !testimonial.featured;
    await testimonial.save();
    return testimonial;
  }

  async toggleLiked(ownerId, testimonialId) {
    const testimonial = await Testimonial.findById(testimonialId).populate('space');
    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    if (testimonial.space.owner.toString() !== ownerId.toString()) {
      throw new AppError('Unauthorized to modify this testimonial', 403);
    }

    testimonial.liked = !testimonial.liked;
    await testimonial.save();
    return testimonial;
  }

  async deleteTestimonial(ownerId, testimonialId) {
    const testimonial = await Testimonial.findById(testimonialId).populate('space');
    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    if (testimonial.space.owner.toString() !== ownerId.toString()) {
      throw new AppError('Unauthorized to delete this testimonial', 403);
    }

    if (testimonial.avatar) {
      uploadService.deleteFile(testimonial.avatar);
    }

    await testimonial.deleteOne();
    return { message: 'Testimonial deleted successfully' };
  }

  async getPublicApprovedTestimonials(spaceSlug) {
    const space = await Space.findOne({ slug: spaceSlug.toLowerCase(), isActive: true });
    if (!space) {
      throw new AppError('Space not found or inactive', 404);
    }

    const testimonials = await Testimonial.find({
      space: space._id,
      status: 'approved'
    }).sort({ featured: -1, createdAt: -1 });

    return {
      space,
      testimonials
    };
  }
}

module.exports = new TestimonialService();
