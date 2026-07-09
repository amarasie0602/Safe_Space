const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  register,
  login,
  resetPassword,
  updateProfile,
  getStats,
  getSavedPosts,
  toggleSavedPost,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.patch('/profile', protect, updateProfile);
router.get('/me/stats', protect, getStats);
router.get('/me/saved-posts', protect, getSavedPosts);
router.patch('/saved-posts/:postId', protect, toggleSavedPost);

module.exports = router;
