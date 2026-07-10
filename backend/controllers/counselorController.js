const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Counselor = require('../models/Counselor');
const Booking = require('../models/Booking');

const SLOT_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

const signToken = (counselor) =>
  jwt.sign({ id: counselor._id, role: counselor.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  const { name, email, password, specialties, credentials } = req.body;

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'password must be at least 6 characters' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const counselor = await Counselor.create({ name, email, passwordHash, specialties, credentials });

  res.status(201).json({ id: counselor._id, name: counselor.name, verified: counselor.verified });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const counselor = await Counselor.findOne({ email }).select('+passwordHash');
  if (!counselor) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, counselor.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = signToken(counselor);
  res.json({
    token,
    counselor: { id: counselor._id, name: counselor.name, role: counselor.role, verified: counselor.verified },
  });
};

const adminVerifyCounselor = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Counselor not found' });
  }

  const counselor = await Counselor.findByIdAndUpdate(req.params.id, { verified: true }, { new: true });

  if (!counselor) {
    return res.status(404).json({ message: 'Counselor not found' });
  }

  res.json(counselor);
};

const getCounselors = async (req, res) => {
  const counselors = await Counselor.find({ verified: true }).select('-passwordHash -email');

  res.json(counselors);
};

const getMySchedule = async (req, res) => {
  const counselor = await Counselor.findById(req.user.id).select('weeklySchedule');
  res.json({ weeklySchedule: counselor.weeklySchedule });
};

const updateMySchedule = async (req, res) => {
  const { weeklySchedule } = req.body;

  if (!Array.isArray(weeklySchedule)) {
    return res.status(400).json({ message: 'weeklySchedule must be an array' });
  }

  for (const entry of weeklySchedule) {
    if (
      typeof entry.dayOfWeek !== 'number' ||
      entry.dayOfWeek < 0 ||
      entry.dayOfWeek > 6 ||
      !Array.isArray(entry.slots) ||
      !entry.slots.every((slot) => SLOT_PATTERN.test(slot))
    ) {
      return res.status(400).json({ message: 'Invalid weeklySchedule entry' });
    }
  }

  const counselor = await Counselor.findByIdAndUpdate(
    req.user.id,
    { weeklySchedule },
    { new: true }
  ).select('weeklySchedule');

  res.json({ weeklySchedule: counselor.weeklySchedule });
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getAvailability = async (req, res) => {
  const { date } = req.query;

  if (!DATE_PATTERN.test(date || '')) {
    return res.status(400).json({ message: 'date must be in YYYY-MM-DD format' });
  }
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(404).json({ message: 'Counselor not found' });
  }

  const counselor = await Counselor.findOne({ _id: req.params.id, verified: true }).select('weeklySchedule');
  if (!counselor) {
    return res.status(404).json({ message: 'Counselor not found' });
  }

  const dayStart = new Date(`${date}T00:00:00`);
  const dayOfWeek = dayStart.getDay();
  const daySchedule = counselor.weeklySchedule.find((entry) => entry.dayOfWeek === dayOfWeek);
  const slots = daySchedule?.slots || [];

  if (slots.length === 0) {
    return res.json({ slots: [] });
  }

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  const existingBookings = await Booking.find({
    counselor: req.params.id,
    status: { $in: ['pending', 'confirmed'] },
    requestedTime: { $gte: dayStart, $lt: dayEnd },
  }).select('requestedTime');

  const bookedTimes = new Set(
    existingBookings.map((b) => {
      const t = new Date(b.requestedTime);
      return `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
    })
  );

  const isToday = dayStart.toDateString() === new Date().toDateString();
  const now = new Date();

  const available = slots.filter((slot) => {
    if (bookedTimes.has(slot)) return false;
    if (isToday) {
      const [h, m] = slot.split(':').map(Number);
      const slotTime = new Date(dayStart);
      slotTime.setHours(h, m, 0, 0);
      if (slotTime < now) return false;
    }
    return true;
  });

  res.json({ slots: available });
};

module.exports = {
  register,
  login,
  adminVerifyCounselor,
  getCounselors,
  getMySchedule,
  updateMySchedule,
  getAvailability,
};
