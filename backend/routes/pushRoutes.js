const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { subscribe, unsubscribe } = require('../controllers/pushController');

const router = express.Router();

router.post('/push/subscribe', protect, subscribe);
router.post('/push/unsubscribe', protect, unsubscribe);

module.exports = router;
