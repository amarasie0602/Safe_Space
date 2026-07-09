const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Post = require('../models/Post');
const Reply = require('../models/Reply');

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const toUserResponse = (user) => ({
  id: user._id,
  pseudonym: user.pseudonym,
  role: user.role,
  avatarId: user.avatarId,
  bio: user.bio,
  createdAt: user.createdAt,
});

const register = async (req, res) => {
  const { pseudonym, password } = req.body;

  const existing = await User.findOne({ pseudonym });
  if (existing) {
    return res.status(409).json({ message: 'Pseudonym already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ pseudonym, passwordHash });

  const token = signToken(user);
  res.status(201).json({ token, user: toUserResponse(user) });
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
  res.json({ token, user: toUserResponse(user) });
};

const updateProfile = async (req, res) => {
  const { avatarId, bio } = req.body;

  if (typeof avatarId !== 'number' || avatarId < 0 || avatarId > 9) {
    return res.status(400).json({ message: 'avatarId must be a number between 0 and 9' });
  }
  if (typeof bio !== 'string' || bio.length > 160) {
    return res.status(400).json({ message: 'bio must be a string of 160 characters or fewer' });
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { avatarId, bio: bio.trim() },
    { new: true }
  );
  res.json(toUserResponse(user));
};

const getStats = async (req, res) => {
  const [postCount, replyCount] = await Promise.all([
    Post.countDocuments({ author: req.user.id }),
    Reply.countDocuments({ author: req.user.id }),
  ]);

  res.json({ postCount, replyCount });
};

module.exports = { register, login, updateProfile, getStats };
