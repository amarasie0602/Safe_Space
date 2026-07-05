const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createThread } = require('../controllers/threadController');

const router = express.Router();

router.post('/threads', protect, createThread);

module.exports = router;
