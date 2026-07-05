const Reply = require('../models/Reply');

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

module.exports = { createReply, flagReply };
