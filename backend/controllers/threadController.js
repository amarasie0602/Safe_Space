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

const getThread = async (req, res) => {
  const thread = await Thread.findById(req.params.id).populate('author', 'pseudonym avatarId');

  if (!thread) {
    return res.status(404).json({ message: 'Thread not found' });
  }

  res.json(thread);
};

const upvoteThread = async (req, res) => {
  const thread = await Thread.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } }, { new: true });

  if (!thread) {
    return res.status(404).json({ message: 'Thread not found' });
  }

  res.json(thread);
};

module.exports = { createThread, getThreads, getThread, upvoteThread };
