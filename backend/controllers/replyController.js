const Reply = require('../models/Reply');

const createReply = async (req, res) => {
  const { body } = req.body;

  const reply = await Reply.create({
    thread: req.params.id,
    author: req.user.id,
    body,
  });

  res.status(201).json(reply);
};

const flagReply = async (req, res) => {
  res.status(501).json({ message: 'Not implemented' });
};

module.exports = { createReply, flagReply };
