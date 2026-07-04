const Post = require('../models/Post');

// Safety-critical: keywords that trigger auto-flagging for moderation review.
// Any post whose content matches one of these is hidden from the public feed
// until a moderator/admin clears it. False positives are preferred over
// missed risk content.
const RISK_KEYWORDS = [
  'suicide',
  'self-harm',
  'self harm',
  'kill myself',
  'end my life',
  'want to die',
];

// Safety-critical: called on every post creation. Do not weaken this check
// without moderator sign-off — it is the only gate before content is public.
const containsRiskKeyword = (content) => {
  const lower = content.toLowerCase();
  return RISK_KEYWORDS.some((keyword) => lower.includes(keyword));
};

const createPost = async (req, res) => {
  const { category, content } = req.body;
  const flagged = containsRiskKeyword(content);

  const post = await Post.create({
    author: req.user.id,
    category,
    content,
    flagged,
    status: flagged ? 'under_review' : 'visible',
  });

  await post.populate('author', 'pseudonym');
  res.status(201).json(post);
};

const getPosts = async (req, res) => {
  const posts = await Post.find({ status: 'visible' })
    .populate('author', 'pseudonym')
    .sort({ createdAt: -1 });

  res.json(posts);
};

const adminGetPosts = async (req, res) => {
  const posts = await Post.find().sort({ createdAt: -1 });

  res.json(posts);
};

module.exports = { createPost, getPosts, adminGetPosts };
