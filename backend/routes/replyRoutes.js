const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createReply } = require('../controllers/replyController');

const router = express.Router();

router.post('/threads/:id/replies', protect, createReply);

module.exports = router;
