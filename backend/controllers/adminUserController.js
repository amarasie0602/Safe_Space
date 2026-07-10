const mongoose = require('mongoose');
const User = require('../models/User');

const findTargetUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(404).json({ message: 'User not found' });
    return null;
  }
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return null;
  }
  if (user.role === 'admin') {
    res.status(400).json({ message: 'Cannot moderate an admin account' });
    return null;
  }
  return user;
};

const suspendUser = async (req, res) => {
  const user = await findTargetUser(req, res);
  if (!user) return;

  const days = Number(req.body.days) || 7;
  user.status = 'suspended';
  user.suspendedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await user.save();

  res.json({ pseudonym: user.pseudonym, status: user.status, suspendedUntil: user.suspendedUntil });
};

const banUser = async (req, res) => {
  const user = await findTargetUser(req, res);
  if (!user) return;

  user.status = 'banned';
  user.suspendedUntil = undefined;
  await user.save();

  res.json({ pseudonym: user.pseudonym, status: user.status });
};

const reinstateUser = async (req, res) => {
  const user = await findTargetUser(req, res);
  if (!user) return;

  user.status = 'active';
  user.suspendedUntil = undefined;
  await user.save();

  res.json({ pseudonym: user.pseudonym, status: user.status });
};

module.exports = { suspendUser, banUser, reinstateUser };
