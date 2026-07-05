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

const adminGetReports = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};

  const reports = await Report.find(filter).sort({ createdAt: -1 });

  res.json(reports);
};

module.exports = { createReport, adminGetReports };
