const Reply = require('../models/Reply');

const getRepliesFor = (field) => async (req, res) => {
  const replies = await Reply.find({ [field]: req.params.id })
    .populate('author', 'pseudonym avatarId')
    .sort({ createdAt: 1 });

  res.json(replies);
};

const createReplyFor = (field) => async (req, res) => {
  const { body } = req.body;

  const reply = await Reply.create({
    [field]: req.params.id,
    author: req.user.id,
    body,
  });

  await reply.populate('author', 'pseudonym avatarId');
  res.status(201).json(reply);
};

const getThreadReplies = getRepliesFor('thread');
const createThreadReply = createReplyFor('thread');
const getPostReplies = getRepliesFor('post');
const createPostReply = createReplyFor('post');

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

module.exports = {
  getThreadReplies,
  createThreadReply,
  getPostReplies,
  createPostReply,
  flagReply,
  upvoteReply,
};
