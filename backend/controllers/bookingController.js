const Booking = require('../models/Booking');
const Counselor = require('../models/Counselor');
const { notify } = require('./notificationController');

const createBooking = async (req, res) => {
  const { counselor, requestedTime, notes } = req.body;

  const time = new Date(requestedTime);
  if (Number.isNaN(time.getTime()) || time < new Date()) {
    return res.status(400).json({ message: 'requestedTime must be in the future' });
  }

  const counselorDoc = await Counselor.findOne({ _id: counselor, verified: true }).select('weeklySchedule');
  if (!counselorDoc) {
    return res.status(404).json({ message: 'Counselor not found' });
  }

  const dayOfWeek = time.getDay();
  const hhmm = `${String(time.getHours()).padStart(2, '0')}:${String(time.getMinutes()).padStart(2, '0')}`;
  const daySchedule = counselorDoc.weeklySchedule.find((entry) => entry.dayOfWeek === dayOfWeek);
  if (!daySchedule?.slots.includes(hhmm)) {
    return res.status(400).json({ message: 'That time is not in the counselor\'s available schedule' });
  }

  try {
    const booking = await Booking.create({
      user: req.user.id,
      counselor,
      requestedTime: time,
      notes,
    });
    res.status(201).json(booking);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'That slot was just booked by someone else. Please pick another.' });
    }
    throw err;
  }
};

const adminGetBookings = async (req, res) => {
  const bookings = await Booking.find()
    .populate('counselor', 'name specialties')
    .sort({ createdAt: -1 });

  res.json(bookings);
};

const getMyCounselorBookings = async (req, res) => {
  const bookings = await Booking.find({ counselor: req.user.id })
    .populate('user', 'pseudonym')
    .sort({ requestedTime: 1 });

  res.json(bookings);
};

const STATUS_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
  if (booking.counselor.toString() !== req.user.id) {
    return res.status(403).json({ message: 'You can only update your own bookings' });
  }
  if (!STATUS_TRANSITIONS[booking.status]?.includes(status)) {
    return res.status(400).json({ message: `Cannot move booking from ${booking.status} to ${status}` });
  }

  booking.status = status;
  await booking.save();
  await booking.populate('user', 'pseudonym');

  await notify({
    recipient: booking.user._id,
    actor: req.user.id,
    type: 'booking_status',
    message: `Your booking status changed to "${status}".`,
    link: '/my-activity',
  });

  res.json(booking);
};

module.exports = {
  createBooking,
  adminGetBookings,
  getMyCounselorBookings,
  updateBookingStatus,
};
