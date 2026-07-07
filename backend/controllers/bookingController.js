const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  const { counselor, requestedTime, notes } = req.body;

  if (new Date(requestedTime) < new Date()) {
    return res.status(400).json({ message: 'requestedTime must be in the future' });
  }

  const booking = await Booking.create({
    user: req.user.id,
    counselor,
    requestedTime,
    notes,
  });

  res.status(201).json(booking);
};

const adminGetBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('counselor', 'name specialties')
    .sort({ createdAt: -1 });

  res.json(bookings);
};

module.exports = { createBooking, adminGetBookings };
