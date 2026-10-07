const Space = require('../models/Space');
const Testimonial = require('../models/Testimonial');
const { AppError } = require('../middleware/error.middleware');
const { slugify, isValidSlug } = require('../utils/validators');
const uploadService = require('./upload.service');

class SpaceService {
  async createSpace(ownerId, data, logoFile) {
    let { name, slug, prompt, requireAvatar, requireRating, customQuestions } = data;

    if (!name) {
      throw new AppError('Space name is required', 400);
    }

    const generatedSlug = slug ? slugify(slug) : slugify(name);
    if (!isValidSlug(generatedSlug)) {
      throw new AppError('Invalid slug format. Use lowercase letters, numbers, and hyphens.', 400);
    }

    const existingSpace = await Space.findOne({ slug: generatedSlug });
    if (existingSpace) {
      throw new AppError('Slug already in use. Please choose another slug.', 409);
    }

    let parsedQuestions = [];
    if (customQuestions) {
      parsedQuestions = typeof customQuestions === 'string' ? JSON.parse(customQuestions) : customQuestions;
    }

    let logo = null;
    if (logoFile) {
      logo = logoFile.filename;
    }

    const space = await Space.create({
      owner: ownerId,
      name: name.trim(),
      slug: generatedSlug,
      logo,
      prompt: prompt || undefined,
      requireAvatar: requireAvatar === 'true' || requireAvatar === true,
      requireRating: requireRating !== undefined ? (requireRating === 'true' || requireRating === true) : true,
      customQuestions: parsedQuestions
    });

    return space;
  }

  async getOwnerSpaces(ownerId) {
    const spaces = await Space.find({ owner: ownerId }).sort({ createdAt: -1 });

    const spacesWithStats = await Promise.all(
      spaces.map(async (space) => {
        const totalTestimonials = await Testimonial.countDocuments({ space: space._id });
        const pendingTestimonials = await Testimonial.countDocuments({ space: space._id, status: 'pending' });
        const approvedTestimonials = await Testimonial.countDocuments({ space: space._id, status: 'approved' });
        
        const spaceObj = space.toObject();
        return {
          ...spaceObj,
          stats: {
            total: totalTestimonials,
            pending: pendingTestimonials,
            approved: approvedTestimonials
          }
        };
      })
    );

    return spacesWithStats;
  }

  async getSpaceById(ownerId, spaceId) {
    const space = await Space.findOne({ _id: spaceId, owner: ownerId });
    if (!space) {
      throw new AppError('Space not found or unauthorized', 404);
    }
    return space;
  }

  async getSpaceBySlug(slug) {
    const space = await Space.findOne({ slug: slug.toLowerCase(), isActive: true });
    if (!space) {
      throw new AppError('Space not found or inactive', 404);
    }
    return space;
  }

  async updateSpace(ownerId, spaceId, data, logoFile) {
    const space = await Space.findOne({ _id: spaceId, owner: ownerId });
    if (!space) {
      throw new AppError('Space not found or unauthorized', 404);
    }

    const { name, slug, prompt, requireAvatar, requireRating, customQuestions, isActive } = data;

    if (name) space.name = name.trim();

    if (slug && slug !== space.slug) {
      const formattedSlug = slugify(slug);
      if (!isValidSlug(formattedSlug)) {
        throw new AppError('Invalid slug format', 400);
      }
      const existing = await Space.findOne({ slug: formattedSlug, _id: { $ne: spaceId } });
      if (existing) {
        throw new AppError('Slug is already taken by another space', 409);
      }
      space.slug = formattedSlug;
    }

    if (prompt !== undefined) space.prompt = prompt;
    if (requireAvatar !== undefined) space.requireAvatar = requireAvatar === 'true' || requireAvatar === true;
    if (requireRating !== undefined) space.requireRating = requireRating === 'true' || requireRating === true;
    if (isActive !== undefined) space.isActive = isActive === 'true' || isActive === true;

    if (customQuestions) {
      space.customQuestions = typeof customQuestions === 'string' ? JSON.parse(customQuestions) : customQuestions;
    }

    if (logoFile) {
      if (space.logo) {
        uploadService.deleteFile(space.logo);
      }
      space.logo = logoFile.filename;
    }

    await space.save();
    return space;
  }

  async deleteSpace(ownerId, spaceId) {
    const space = await Space.findOne({ _id: spaceId, owner: ownerId });
    if (!space) {
      throw new AppError('Space not found or unauthorized', 404);
    }

    if (space.logo) {
      uploadService.deleteFile(space.logo);
    }

    // Delete associated testimonials and their avatars
    const testimonials = await Testimonial.find({ space: spaceId });
    for (const t of testimonials) {
      if (t.avatar) {
        uploadService.deleteFile(t.avatar);
      }
    }
    await Testimonial.deleteMany({ space: spaceId });
    await space.deleteOne();

    return { message: 'Space and associated testimonials deleted successfully' };
  }

  async isSlugAvailable(slug, currentSpaceId = null) {
    const formattedSlug = slugify(slug);
    const query = { slug: formattedSlug };
    if (currentSpaceId) {
      query._id = { $ne: currentSpaceId };
    }
    const existing = await Space.findOne(query);
    return { available: !existing, slug: formattedSlug };
  }
}

module.exports = new SpaceService();
