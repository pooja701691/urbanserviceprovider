const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const {
  createService,
  getAllServices,
  getSingleService,
  updateService,
  getNearbyServices,
  deleteService,
  addReview,
} = require('../controllers/service.controller');

const router = express.Router();

// PUBLIC — /nearby MUST come before /:id
router.get('/', getAllServices);
router.get('/nearby', getNearbyServices);
router.get('/:id', getSingleService);

// PROTECTED — authenticated users can add reviews
router.post('/:id/reviews', protect, addReview);

// ADMIN ONLY
router.post('/create', protect, adminOnly, upload.array('images', 6), createService);
router.put('/update/:id', protect, adminOnly, upload.array('images', 6), updateService);
router.delete('/delete/:id', protect, adminOnly, deleteService);

module.exports = router;
