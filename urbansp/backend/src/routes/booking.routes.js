const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const bookingController = require('../controllers/booking.controller');

router.post('/create', protect, bookingController.createBooking);
router.get('/', protect, bookingController.getBookings);
router.put('/status/:id', protect, adminOnly, bookingController.updateBookingStatus);
router.put('/cancel/:id', protect, bookingController.cancelBooking);

module.exports = router;
