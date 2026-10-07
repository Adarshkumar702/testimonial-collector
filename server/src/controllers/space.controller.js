const spaceService = require('../services/space.service');
const uploadService = require('../services/upload.service');

class SpaceController {
  async createSpace(req, res, next) {
    try {
      const space = await spaceService.createSpace(req.user._id, req.body, req.file);
      const spaceObj = space.toObject();
      if (spaceObj.logo) {
        spaceObj.logoUrl = uploadService.getFileUrl(req, spaceObj.logo);
      }

      res.status(201).json({
        success: true,
        message: 'Space created successfully',
        data: spaceObj
      });
    } catch (error) {
      if (req.file) uploadService.deleteFile(req.file.filename);
      next(error);
    }
  }

  async getOwnerSpaces(req, res, next) {
    try {
      const spaces = await spaceService.getOwnerSpaces(req.user._id);
      const formattedSpaces = spaces.map(space => ({
        ...space,
        logoUrl: space.logo ? uploadService.getFileUrl(req, space.logo) : null
      }));

      res.status(200).json({
        success: true,
        data: formattedSpaces
      });
    } catch (error) {
      next(error);
    }
  }

  async getSpaceById(req, res, next) {
    try {
      const space = await spaceService.getSpaceById(req.user._id, req.params.id);
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

  async updateSpace(req, res, next) {
    try {
      const space = await spaceService.updateSpace(req.user._id, req.params.id, req.body, req.file);
      const spaceObj = space.toObject();
      if (spaceObj.logo) {
        spaceObj.logoUrl = uploadService.getFileUrl(req, spaceObj.logo);
      }

      res.status(200).json({
        success: true,
        message: 'Space updated successfully',
        data: spaceObj
      });
    } catch (error) {
      if (req.file) uploadService.deleteFile(req.file.filename);
      next(error);
    }
  }

  async deleteSpace(req, res, next) {
    try {
      const result = await spaceService.deleteSpace(req.user._id, req.params.id);
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }

  async checkSlug(req, res, next) {
    try {
      const { slug, currentSpaceId } = req.query;
      const result = await spaceService.isSlugAvailable(slug, currentSpaceId);
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new SpaceController();
