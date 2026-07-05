const express = require('express');
const { register, login } = require('../controllers/counselorController');

const router = express.Router();

router.post('/counselors/register', register);
router.post('/counselors/login', login);

module.exports = router;
