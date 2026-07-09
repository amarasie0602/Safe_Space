const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { getReplies, createReply, flagReply, upvoteReply } = require('../controllers/replyController');

const router = express.Router();

router.get('/threads/:id/replies', getReplies);
router.post('/threads/:id/replies', protect, createReply);
router.patch('/replies/:id/flag', protect, flagReply);
router.patch('/replies/:id/upvote', protect, upvoteReply);

module.exports = router;
