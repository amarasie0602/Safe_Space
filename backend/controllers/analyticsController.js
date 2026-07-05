const Post = require('../models/Post');

const getAnalytics = async (req, res) => {
  const postsByCategory = await Post.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  res.json({ postsByCategory });
};

module.exports = { getAnalytics };
