const Report = require('../models/Report');

const createReport = async (req, res) => {
  const { targetType, targetId, reason } = req.body;

  const report = await Report.create({
    reporter: req.user.id,
    targetType,
    targetId,
    reason,
  });

  res.status(201).json(report);
};

module.exports = { createReport };
