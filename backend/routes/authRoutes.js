const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { register, login, resetPassword, updateProfile, getStats } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-password', resetPassword);
router.patch('/profile', protect, updateProfile);
router.get('/me/stats', protect, getStats);

module.exports = router;
