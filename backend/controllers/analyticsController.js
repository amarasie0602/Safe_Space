const Post = require('../models/Post');
const Report = require('../models/Report');

const CATEGORIES = ['mental_health', 'relationships', 'family', 'financial', 'work_burnout', 'gratitude'];

const getAnalytics = async (req, res) => {
  const postCounts = await Post.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
  ]);
  const countsByCategory = Object.fromEntries(postCounts.map((c) => [c._id, c.count]));
  const postsByCategory = CATEGORIES.map((category) => ({
    _id: category,
    count: countsByCategory[category] || 0,
  }));

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
