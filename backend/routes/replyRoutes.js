const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createReply, flagReply } = require('../controllers/replyController');

const router = express.Router();

router.post('/threads/:id/replies', protect, createReply);
router.patch('/replies/:id/flag', protect, flagReply);

module.exports = router;
