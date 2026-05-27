const express = require('express');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const { getAnalytics } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/analytics', protect, adminOnly, getAnalytics);

module.exports = router;
