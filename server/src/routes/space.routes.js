const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/space.controller');
const { authenticate } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router.use(authenticate);

router.post('/', upload.single('logo'), (req, res, next) => spaceController.createSpace(req, res, next));
router.get('/', (req, res, next) => spaceController.getOwnerSpaces(req, res, next));
router.get('/check-slug', (req, res, next) => spaceController.checkSlug(req, res, next));
router.get('/:id', (req, res, next) => spaceController.getSpaceById(req, res, next));
router.put('/:id', upload.single('logo'), (req, res, next) => spaceController.updateSpace(req, res, next));
router.delete('/:id', (req, res, next) => spaceController.deleteSpace(req, res, next));

module.exports = router;
