const express = require('express');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { suspendUser, banUser, reinstateUser } = require('../controllers/adminUserController');

const router = express.Router();

router.patch('/admin/users/:id/suspend', protect, adminOnly, suspendUser);
router.patch('/admin/users/:id/ban', protect, adminOnly, banUser);
router.patch('/admin/users/:id/reinstate', protect, adminOnly, reinstateUser);

module.exports = router;
