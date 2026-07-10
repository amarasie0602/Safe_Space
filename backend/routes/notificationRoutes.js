const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getMyNotifications,
  markAllRead,
  subscribeNotifications,
} = require('../controllers/notificationController');

const router = express.Router();

router.get('/notifications', protect, getMyNotifications);
router.get('/notifications/stream', subscribeNotifications);
router.patch('/notifications/read-all', protect, markAllRead);

module.exports = router;
