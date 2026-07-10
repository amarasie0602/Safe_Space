const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Counselor = require('../models/Counselor');

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

module.exports = { register, login, adminVerifyCounselor, getCounselors };
