const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createBooking, adminGetBookings } = require('../controllers/bookingController');

const router = express.Router();

router.post('/bookings', protect, createBooking);
router.get('/admin/bookings', protect, adminOnly, adminGetBookings);

module.exports = router;
