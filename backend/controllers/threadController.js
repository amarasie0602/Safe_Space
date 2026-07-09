const Thread = require('../models/Thread');

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
  const { category } = req.query;
  const filter = category ? { category } : {};

  const threads = await Thread.find(filter)
    .populate('author', 'pseudonym avatarId')
    .sort({ createdAt: -1 });

  res.json(threads);
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
