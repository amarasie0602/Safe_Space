const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { getAnalytics } = require('../controllers/analyticsController');

const router = express.Router();

router.get('/admin/analytics', protect, adminOnly, getAnalytics);

module.exports = router;
