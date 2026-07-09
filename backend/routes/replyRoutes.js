const express = require('express');
const { protect } = require('../middleware/authMiddleware');
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
router.post('/threads/:id/replies', protect, contentLimiter, createThreadReply);
router.get('/posts/:id/replies', getPostReplies);
router.post('/posts/:id/replies', protect, contentLimiter, createPostReply);
router.patch('/replies/:id/flag', protect, flagReply);
router.patch('/replies/:id/upvote', protect, upvoteReply);

module.exports = router;
