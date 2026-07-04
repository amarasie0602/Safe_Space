const bcrypt = require('bcryptjs');
const User = require('../models/User');

const register = async (req, res) => {
  const { pseudonym, password } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ pseudonym, passwordHash });

  res.status(201).json({ user: { id: user._id, pseudonym: user.pseudonym, role: user.role } });
};

const login = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

module.exports = { register, login };
