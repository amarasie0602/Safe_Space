const express = require('express');
const { protect, adminOnly, counselorOnly } = require('../middleware/authMiddleware');
const {
  createBooking,
  adminGetBookings,
  getMyCounselorBookings,
  updateBookingStatus,
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/bookings', protect, createBooking);
router.get('/admin/bookings', protect, adminOnly, adminGetBookings);
router.get('/bookings/mine', protect, counselorOnly, getMyCounselorBookings);
router.patch('/bookings/:id/status', protect, counselorOnly, updateBookingStatus);

module.exports = router;
