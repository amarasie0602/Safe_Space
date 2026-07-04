const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
  createPost,
  getPosts,
  adminGetPosts,
  updatePostStatus,
  adminDeletePost,
} = require('../controllers/postController');

const router = express.Router();

router.post('/posts', protect, createPost);
router.get('/posts', getPosts);
router.get('/admin/posts', protect, adminOnly, adminGetPosts);
router.patch('/admin/posts/:id/status', protect, adminOnly, updatePostStatus);
router.delete('/admin/posts/:id', protect, adminOnly, adminDeletePost);

module.exports = router;
