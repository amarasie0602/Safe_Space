const express = require('express');
const { protect, requireActiveUser } = require('../middleware/authMiddleware');
const { contentLimiter } = require('../middleware/rateLimiters');
const {
  getThreadReplies,
  createThreadReply,
  getPostReplies,
  createPostReply,
  flagReply,
  upvoteReply,
} = require('../controllers/replyController');

const router = express.Router();

router.get('/threads/:id/replies', getThreadReplies);
router.post('/threads/:id/replies', protect, requireActiveUser, contentLimiter, createThreadReply);
router.get('/posts/:id/replies', getPostReplies);
router.post('/posts/:id/replies', protect, requireActiveUser, contentLimiter, createPostReply);
router.patch('/replies/:id/flag', protect, flagReply);
router.patch('/replies/:id/upvote', protect, upvoteReply);

module.exports = router;
