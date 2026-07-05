const Thread = require('../models/Thread');

const createThread = async (req, res) => {
  const { category, title, body } = req.body;

  const thread = await Thread.create({
    author: req.user.id,
    category,
    title,
    body,
  });

  await thread.populate('author', 'pseudonym');
  res.status(201).json(thread);
};

const getThreads = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

module.exports = { createThread, getThreads };
