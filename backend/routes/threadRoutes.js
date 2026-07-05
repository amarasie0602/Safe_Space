const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createThread, getThreads, getThread } = require('../controllers/threadController');

const router = express.Router();

router.post('/threads', protect, createThread);
router.get('/threads', getThreads);
router.get('/threads/:id', getThread);

module.exports = router;
