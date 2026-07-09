const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiters');
const { register, login, getCounselors, adminVerifyCounselor } = require('../controllers/counselorController');

const router = express.Router();

router.post('/counselors/register', authLimiter, register);
router.post('/counselors/login', authLimiter, login);
router.get('/counselors', getCounselors);
router.post('/admin/counselors/verify/:id', protect, adminOnly, adminVerifyCounselor);

module.exports = router;
