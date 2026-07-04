const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { createPost, getPosts } = require('../controllers/postController');

const router = express.Router();

router.post('/posts', protect, createPost);
router.get('/posts', getPosts);

module.exports = router;
