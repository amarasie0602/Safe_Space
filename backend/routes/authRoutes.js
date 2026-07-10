const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');
const {
  register,
  login,
  resetPassword,
  regenerateRecoveryCode,
  updateProfile,
  getStats,
  getMyReplies,
  getSavedPosts,
  toggleSavedPost,
  getBlockedUsers,
  blockUser,
  unblockUser,
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/me/recovery-code/regenerate', protect, authLimiter, regenerateRecoveryCode);
router.patch('/profile', protect, updateProfile);
router.get('/me/stats', protect, getStats);
router.get('/me/replies', protect, getMyReplies);
router.get('/me/saved-posts', protect, getSavedPosts);
router.patch('/saved-posts/:postId', protect, toggleSavedPost);
router.get('/me/blocked-users', protect, getBlockedUsers);
router.post('/users/:id/block', protect, blockUser);
router.post('/users/:id/unblock', protect, unblockUser);

module.exports = router;
