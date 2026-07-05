const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  const { counselor, requestedTime, notes } = req.body;

  const booking = await Booking.create({
    user: req.user.id,
    counselor,
    requestedTime,
    notes,
  });

  res.status(201).json(booking);
};

module.exports = { createBooking };
