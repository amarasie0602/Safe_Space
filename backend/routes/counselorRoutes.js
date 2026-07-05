const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { register, login, getCounselors, adminVerifyCounselor } = require('../controllers/counselorController');

const router = express.Router();

router.post('/counselors/register', register);
router.post('/counselors/login', login);
router.get('/counselors', getCounselors);
router.post('/admin/counselors/verify/:id', protect, adminOnly, adminVerifyCounselor);

module.exports = router;
