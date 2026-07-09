const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { register, login, updateProfile, getStats } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', protect, updateProfile);
router.get('/me/stats', protect, getStats);

module.exports = router;
