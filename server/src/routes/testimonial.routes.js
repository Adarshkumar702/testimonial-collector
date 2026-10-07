const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonial.controller');
const { authenticate } = require('../middleware/auth.middleware');

router.use(authenticate);

// List testimonials for a specific space
router.get('/space/:spaceId', (req, res, next) => testimonialController.getSpaceTestimonials(req, res, next));

// Moderation actions
router.patch('/:id/approve', (req, res, next) => testimonialController.approveTestimonial(req, res, next));
router.patch('/:id/reject', (req, res, next) => testimonialController.rejectTestimonial(req, res, next));
router.patch('/:id/archive', (req, res, next) => testimonialController.archiveTestimonial(req, res, next));
router.patch('/:id/feature', (req, res, next) => testimonialController.featureTestimonial(req, res, next));
router.patch('/:id/like', (req, res, next) => testimonialController.likeTestimonial(req, res, next));
router.delete('/:id', (req, res, next) => testimonialController.deleteTestimonial(req, res, next));

module.exports = router;
