const express = require('express');
const { protect, adminOnly, requireActiveUser } = require('../middleware/authMiddleware');
const { contentLimiter, postCooldown } = require('../middleware/rateLimiters');
const {
  createPost,
  getPosts,
  adminGetPosts,
  updatePostStatus,
  adminDeletePost,
  toggleSupport,
} = require('../controllers/postController');

const router = express.Router();

router.post('/posts', protect, requireActiveUser, contentLimiter, postCooldown, createPost);
router.get('/posts', getPosts);
router.get('/admin/posts', protect, adminOnly, adminGetPosts);
router.patch('/admin/posts/:id/status', protect, adminOnly, updatePostStatus);
router.delete('/admin/posts/:id', protect, adminOnly, adminDeletePost);
router.patch('/posts/:id/support', protect, toggleSupport);

module.exports = router;
