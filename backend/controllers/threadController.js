const Thread = require('../models/Thread');

// Escapes regex special characters so search input is matched literally
// instead of being interpreted as a (possibly catastrophic) pattern.
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const createThread = async (req, res) => {
  const { category, title, body } = req.body;

  const thread = await Thread.create({
    author: req.user.id,
    category,
    title,
    body,
  });

  await thread.populate('author', 'pseudonym avatarId');
  res.status(201).json(thread);
};

const getThreads = async (req, res) => {
  const { category, search } = req.query;
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);

  const filter = {};
  if (category) filter.category = category;
  if (search) filter.title = { $regex: escapeRegex(search.trim()), $options: 'i' };

  const [threads, total] = await Promise.all([
    Thread.find(filter)
      .populate('author', 'pseudonym avatarId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Thread.countDocuments(filter),
  ]);

  res.json({ threads, page, hasMore: page * limit < total, total });
};

const getMySupportedThreads = async (req, res) => {
  const threads = await Thread.find({ upvotedBy: req.user.id })
    .populate('author', 'pseudonym avatarId')
    .sort({ createdAt: -1 });

  res.json(threads);
};

const getThread = async (req, res) => {
  const thread = await Thread.findById(req.params.id).populate('author', 'pseudonym avatarId');

  if (!thread) {
    return res.status(404).json({ message: 'Thread not found' });
  }

  res.json(thread);
};

const upvoteThread = async (req, res) => {
  const thread = await Thread.findById(req.params.id).select('upvotes upvotedBy');
  if (!thread) {
    return res.status(404).json({ message: 'Thread not found' });
  }

  const userId = req.user.id;
  const alreadySupported = thread.upvotedBy.some((id) => id.toString() === userId);

  if (alreadySupported) {
    thread.upvotedBy = thread.upvotedBy.filter((id) => id.toString() !== userId);
    thread.upvotes = Math.max(0, thread.upvotes - 1);
  } else {
    thread.upvotedBy.push(userId);
    thread.upvotes += 1;
  }
  await thread.save();

  res.json({ upvotes: thread.upvotes, supported: !alreadySupported });
};

module.exports = { createThread, getThreads, getThread, upvoteThread, getMySupportedThreads };
