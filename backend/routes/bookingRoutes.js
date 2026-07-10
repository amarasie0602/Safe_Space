const express = require('express');
const { protect, adminOnly, counselorOnly } = require('../middleware/authMiddleware');
const {
  createBooking,
  adminGetBookings,
  getMyCounselorBookings,
  getMyBookingsAsClient,
  updateBookingStatus,
  createReview,
  getCounselorReviews,
} = require('../controllers/bookingController');

const router = express.Router();

router.post('/bookings', protect, createBooking);
router.get('/admin/bookings', protect, adminOnly, adminGetBookings);
router.get('/bookings/mine', protect, counselorOnly, getMyCounselorBookings);
router.get('/bookings/mine-as-client', protect, getMyBookingsAsClient);
router.patch('/bookings/:id/status', protect, counselorOnly, updateBookingStatus);
router.post('/bookings/:id/review', protect, createReview);
router.get('/counselors/:id/reviews', getCounselorReviews);

module.exports = router;
