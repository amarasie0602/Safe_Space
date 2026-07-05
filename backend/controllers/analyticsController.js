const Post = require('../models/Post');

const getAnalytics = async (req, res) => {
  const postsByCategory = await Post.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  const flaggedCount = await Post.countDocuments({ flagged: true });

  res.json({ postsByCategory, flaggedCount });
};

module.exports = { getAnalytics };
