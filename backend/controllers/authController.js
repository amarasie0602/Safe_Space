const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
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

// Groups of 4 uppercase alphanumeric characters (e.g. "AB3D-9KXQ-7Z2M") —
// this is the only password-recovery path for a pseudonymous, emailless
// account, so it needs to be something a user can realistically write down.
const generateRecoveryCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O/1/I to avoid ambiguity
  const group = () =>
    Array.from({ length: 4 }, () => chars[crypto.randomInt(chars.length)]).join('');
  return `${group()}-${group()}-${group()}`;
};

const register = async (req, res) => {
  const { pseudonym, password } = req.body;

  if (typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ message: 'password must be at least 6 characters' });
  }

  const existing = await User.findOne({ pseudonym });
  if (existing) {
    return res.status(409).json({ message: 'Pseudonym already taken' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const recoveryCode = generateRecoveryCode();
  const recoveryCodeHash = await bcrypt.hash(recoveryCode, 10);
  const user = await User.create({ pseudonym, passwordHash, recoveryCodeHash });

  const token = signToken(user);
  res.status(201).json({ token, user: toUserResponse(user), recoveryCode });
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

  if (user.status === 'banned') {
    return res.status(403).json({ message: 'This account has been banned.' });
  }
  if (user.status === 'suspended') {
    if (user.suspendedUntil && user.suspendedUntil <= new Date()) {
      user.status = 'active';
      user.suspendedUntil = undefined;
      await user.save();
    } else {
      const until = user.suspendedUntil ? user.suspendedUntil.toLocaleDateString() : 'further notice';
      return res.status(403).json({ message: `This account is suspended until ${until}.` });
    }
  }

  const token = signToken(user);
  res.json({ token, user: toUserResponse(user) });
};

const resetPassword = async (req, res) => {
  const { pseudonym, recoveryCode, newPassword } = req.body;

  if (typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ message: 'newPassword must be at least 6 characters' });
  }

  const user = await User.findOne({ pseudonym }).select('+recoveryCodeHash');
  if (!user || !user.recoveryCodeHash) {
    return res.status(401).json({ message: 'Invalid pseudonym or recovery code' });
  }

  const match = await bcrypt.compare(recoveryCode || '', user.recoveryCodeHash);
  if (!match) {
    return res.status(401).json({ message: 'Invalid pseudonym or recovery code' });
  }

  // Rotate the recovery code on every use so a leaked-and-reused code can't
  // grant repeat access.
  const nextRecoveryCode = generateRecoveryCode();
  user.passwordHash = await bcrypt.hash(newPassword, 10);
  user.recoveryCodeHash = await bcrypt.hash(nextRecoveryCode, 10);
  await user.save();

  res.json({ message: 'Password updated', recoveryCode: nextRecoveryCode });
};

const regenerateRecoveryCode = async (req, res) => {
  const { password } = req.body;

  const user = await User.findById(req.user.id).select('+passwordHash');
  const match = await bcrypt.compare(password || '', user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: 'Incorrect password' });
  }

  const recoveryCode = generateRecoveryCode();
  user.recoveryCodeHash = await bcrypt.hash(recoveryCode, 10);
  await user.save();

  res.json({ recoveryCode });
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

const getMyReplies = async (req, res) => {
  const replies = await Reply.find({ author: req.user.id })
    .populate('thread', 'title')
    .populate('post', 'content')
    .sort({ createdAt: -1 });

  res.json(replies);
};

const getSavedPosts = async (req, res) => {
  const user = await User.findById(req.user.id).populate({
    path: 'savedPosts',
    populate: { path: 'author', select: 'pseudonym avatarId' },
  });

  res.json(user.savedPosts);
};

const toggleSavedPost = async (req, res) => {
  const { postId } = req.params;
  const user = await User.findById(req.user.id).select('savedPosts');
  const alreadySaved = user.savedPosts.some((id) => id.toString() === postId);

  if (alreadySaved) {
    user.savedPosts = user.savedPosts.filter((id) => id.toString() !== postId);
  } else {
    user.savedPosts.push(postId);
  }
  await user.save();

  res.json({ saved: !alreadySaved, savedPosts: user.savedPosts });
};

const getBlockedUsers = async (req, res) => {
  const user = await User.findById(req.user.id).populate('blockedUsers', 'pseudonym avatarId');
  res.json(user.blockedUsers);
};

const blockUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'User not found' });
  }
  if (id === req.user.id) {
    return res.status(400).json({ message: 'You cannot block yourself' });
  }

  const target = await User.findById(id).select('_id');
  if (!target) {
    return res.status(404).json({ message: 'User not found' });
  }

  await User.findByIdAndUpdate(req.user.id, { $addToSet: { blockedUsers: id } });
  res.json({ blocked: true });
};

const unblockUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: 'User not found' });
  }
  await User.findByIdAndUpdate(req.user.id, { $pull: { blockedUsers: id } });
  res.json({ blocked: false });
};

module.exports = {
  register,
  login,
  resetPassword,
  regenerateRecoveryCode,
  updateProfile,
  getStats,
  getMyReplies,
  getSavedPosts,
  toggleSavedPost,
  getBlockedUsers,
  blockUser,
  unblockUser,
};
