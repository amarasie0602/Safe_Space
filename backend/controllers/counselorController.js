const bcrypt = require('bcryptjs');
const Counselor = require('../models/Counselor');

const register = async (req, res) => {
  const { name, email, password, specialties, credentials } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);
  const counselor = await Counselor.create({ name, email, passwordHash, specialties, credentials });

  res.status(201).json({ id: counselor._id, name: counselor.name, verified: counselor.verified });
};

const login = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

module.exports = { register, login };
