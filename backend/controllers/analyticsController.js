const Post = require('../models/Post');
const Report = require('../models/Report');

const getAnalytics = async (req, res) => {
  const postsByCategory = await Post.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);

  const flaggedCount = await Post.countDocuments({ flagged: true });

  const resolutionStats = await Report.aggregate([
    { $match: { status: 'resolved', resolvedAt: { $ne: null } } },
    { $project: { resolutionMs: { $subtract: ['$resolvedAt', '$createdAt'] } } },
    { $group: { _id: null, avgResolutionMs: { $avg: '$resolutionMs' } } },
  ]);

  res.json({
    postsByCategory,
    flaggedCount,
    avgResolutionMs: resolutionStats[0]?.avgResolutionMs || 0,
  });
};

module.exports = { getAnalytics };
