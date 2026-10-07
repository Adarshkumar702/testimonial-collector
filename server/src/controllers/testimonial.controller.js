const testimonialService = require('../services/testimonial.service');
const uploadService = require('../services/upload.service');

class TestimonialController {
  async getSpaceTestimonials(req, res, next) {
    try {
      const { spaceId } = req.params;
      const result = await testimonialService.getSpaceTestimonials(req.user._id, spaceId, req.query);

      const formattedTestimonials = result.testimonials.map(t => {
        const obj = t.toObject();
        if (obj.avatar) {
          obj.avatarUrl = uploadService.getFileUrl(req, obj.avatar);
        }
        return obj;
      });

      res.status(200).json({
        success: true,
        data: {
          testimonials: formattedTestimonials,
          pagination: result.pagination
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async approveTestimonial(req, res, next) {
    try {
      const testimonial = await testimonialService.updateTestimonialStatus(req.user._id, req.params.id, 'approved');
      res.status(200).json({
        success: true,
        message: 'Testimonial approved',
        data: testimonial
      });
    } catch (error) {
      next(error);
    }
  }

  async rejectTestimonial(req, res, next) {
    try {
      const testimonial = await testimonialService.updateTestimonialStatus(req.user._id, req.params.id, 'rejected');
      res.status(200).json({
        success: true,
        message: 'Testimonial rejected',
        data: testimonial
      });
    } catch (error) {
      next(error);
    }
  }

  async archiveTestimonial(req, res, next) {
    try {
      const testimonial = await testimonialService.updateTestimonialStatus(req.user._id, req.params.id, 'archived');
      res.status(200).json({
        success: true,
        message: 'Testimonial archived',
        data: testimonial
      });
    } catch (error) {
      next(error);
    }
  }

  async featureTestimonial(req, res, next) {
    try {
      const testimonial = await testimonialService.toggleFeatured(req.user._id, req.params.id);
      res.status(200).json({
        success: true,
        message: testimonial.featured ? 'Testimonial marked as featured' : 'Testimonial removed from featured',
        data: testimonial
      });
    } catch (error) {
      next(error);
    }
  }

  async likeTestimonial(req, res, next) {
    try {
      const testimonial = await testimonialService.toggleLiked(req.user._id, req.params.id);
      res.status(200).json({
        success: true,
        message: testimonial.liked ? 'Testimonial liked' : 'Testimonial unliked',
        data: testimonial
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteTestimonial(req, res, next) {
    try {
      const result = await testimonialService.deleteTestimonial(req.user._id, req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new TestimonialController();
