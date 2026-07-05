const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createReport, adminGetReports, resolveReport } = require('../controllers/reportController');

const router = express.Router();

router.post('/reports', protect, createReport);
router.get('/admin/reports', protect, adminOnly, adminGetReports);
router.patch('/admin/reports/:id/resolve', protect, adminOnly, resolveReport);

module.exports = router;
