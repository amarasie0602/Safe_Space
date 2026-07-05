const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createReport, adminGetReports } = require('../controllers/reportController');

const router = express.Router();

router.post('/reports', protect, createReport);
router.get('/admin/reports', protect, adminOnly, adminGetReports);

module.exports = router;
