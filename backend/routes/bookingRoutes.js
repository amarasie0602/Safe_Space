const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createBooking } = require('../controllers/bookingController');

const router = express.Router();

router.post('/bookings', protect, createBooking);

module.exports = router;
