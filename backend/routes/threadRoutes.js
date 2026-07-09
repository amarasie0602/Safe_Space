const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { contentLimiter } = require('../middleware/rateLimiters');
const {
  createThread,
  getThreads,
  getThread,
  upvoteThread,
  getMySupportedThreads,
} = require('../controllers/threadController');

const router = express.Router();

router.post('/threads', protect, contentLimiter, createThread);
router.get('/threads', getThreads);
router.get('/threads/mine/supported', protect, getMySupportedThreads);
router.get('/threads/:id', getThread);
router.patch('/threads/:id/upvote', protect, upvoteThread);

module.exports = router;
