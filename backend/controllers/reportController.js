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

const resolveReport = async (req, res) => {
  const { status } = req.body;

  const report = await Report.findByIdAndUpdate(
    req.params.id,
    { status, resolvedBy: req.user.id, resolvedAt: new Date() },
    { new: true }
  );

  if (!report) {
    return res.status(404).json({ message: 'Report not found' });
  }

  res.json(report);
};

module.exports = { createReport, adminGetReports, resolveReport };
