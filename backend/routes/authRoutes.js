const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { register, login, updateProfile } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.patch('/profile', protect, updateProfile);

module.exports = router;
