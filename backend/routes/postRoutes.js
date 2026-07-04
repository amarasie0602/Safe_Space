const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { createPost, getPosts, adminGetPosts } = require('../controllers/postController');

const router = express.Router();

router.post('/posts', protect, createPost);
router.get('/posts', getPosts);
router.get('/admin/posts', protect, adminOnly, adminGetPosts);

module.exports = router;
