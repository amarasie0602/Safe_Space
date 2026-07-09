const Reply = require('../models/Reply');

const getReplies = async (req, res) => {
  const replies = await Reply.find({ thread: req.params.id })
    .populate('author', 'pseudonym')
    .sort({ createdAt: 1 });

  res.json(replies);
};

const createReply = async (req, res) => {
  const { body } = req.body;

  const reply = await Reply.create({
    thread: req.params.id,
    author: req.user.id,
    body,
  });

  await reply.populate('author', 'pseudonym');
  res.status(201).json(reply);
};

const flagReply = async (req, res) => {
  const reply = await Reply.findByIdAndUpdate(req.params.id, { flagged: true }, { new: true });

  if (!reply) {
    return res.status(404).json({ message: 'Reply not found' });
  }

  res.json(reply);
};

const upvoteReply = async (req, res) => {
  const reply = await Reply.findByIdAndUpdate(req.params.id, { $inc: { upvotes: 1 } }, { new: true });

  if (!reply) {
    return res.status(404).json({ message: 'Reply not found' });
  }

  res.json(reply);
};

module.exports = { getReplies, createReply, flagReply, upvoteReply };
