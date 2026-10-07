const express = require('express');
const router = express.Router();
const publicController = require('../controllers/public.controller');
const upload = require('../middleware/upload.middleware');

// Public collection page details
router.get('/spaces/:spaceSlug', (req, res, next) => publicController.getPublicSpace(req, res, next));

// Public testimonial submission
router.post('/spaces/:spaceSlug/testimonials', upload.single('avatar'), (req, res, next) => publicController.submitTestimonial(req, res, next));

// Public approved testimonials for Wall of Love / Embeds
router.get('/spaces/:spaceSlug/approved', (req, res, next) => publicController.getApprovedTestimonials(req, res, next));

module.exports = router;
