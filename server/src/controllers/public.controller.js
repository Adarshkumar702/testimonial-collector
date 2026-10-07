const spaceService = require('../services/space.service');
const testimonialService = require('../services/testimonial.service');
const uploadService = require('../services/upload.service');

class PublicController {
  async getPublicSpace(req, res, next) {
    try {
      const space = await spaceService.getSpaceBySlug(req.params.spaceSlug);
      const spaceObj = space.toObject();
      if (spaceObj.logo) {
        spaceObj.logoUrl = uploadService.getFileUrl(req, spaceObj.logo);
      }

      res.status(200).json({
        success: true,
        data: spaceObj
      });
    } catch (error) {
      next(error);
    }
  }

  async submitTestimonial(req, res, next) {
    try {
      const { spaceSlug } = req.params;
      const testimonial = await testimonialService.submitPublicTestimonial(spaceSlug, req.body, req.file);

      const obj = testimonial.toObject();
      if (obj.avatar) {
        obj.avatarUrl = uploadService.getFileUrl(req, obj.avatar);
      }

      res.status(201).json({
        success: true,
        message: 'Thank you! Your testimonial has been submitted successfully and is pending review.',
        data: obj
      });
    } catch (error) {
      if (req.file) uploadService.deleteFile(req.file.filename);
      next(error);
    }
  }

  async getApprovedTestimonials(req, res, next) {
    try {
      const { spaceSlug } = req.params;
      const { space, testimonials } = await testimonialService.getPublicApprovedTestimonials(spaceSlug);

      const spaceObj = space.toObject();
      if (spaceObj.logo) {
        spaceObj.logoUrl = uploadService.getFileUrl(req, spaceObj.logo);
      }

      const formattedTestimonials = testimonials.map(t => {
        const obj = t.toObject();
        if (obj.avatar) {
          obj.avatarUrl = uploadService.getFileUrl(req, obj.avatar);
        }
        return obj;
      });

      res.status(200).json({
        success: true,
        data: {
          space: spaceObj,
          testimonials: formattedTestimonials
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PublicController();
