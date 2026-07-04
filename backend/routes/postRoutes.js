const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createPost } = require('../controllers/postController');

const router = express.Router();

router.post('/posts', protect, createPost);

module.exports = router;
