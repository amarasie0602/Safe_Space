const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const register = async (req, res) => {
  const { pseudonym, password } = req.body;

  const existing = await User.findOne({ pseudonym });
  if (existing) {
    return res.status(409).json({ message: 'Pseudonym already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ pseudonym, passwordHash });

  const token = signToken(user);
  res.status(201).json({ token, user: { id: user._id, pseudonym: user.pseudonym, role: user.role } });
};

const login = async (req, res) => {
  const { pseudonym, password } = req.body;

  const user = await User.findOne({ pseudonym }).select('+passwordHash');
  if (!user) {
    return res.status(401).json({ message: 'Invalid pseudonym or password' });
  }

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid pseudonym or password' });
  }

  const token = signToken(user);
  res.json({ token, user: { id: user._id, pseudonym: user.pseudonym, role: user.role } });
};

module.exports = { register, login };
