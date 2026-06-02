const express = require('express');
const router = express.Router();
const { submitContact, getAllContacts } = require('../controllers/contact.controller');
const { protect, adminOnly } = require('../middlewares/auth.middleware');

router.post('/', submitContact);
router.get('/', protect, adminOnly, getAllContacts);

module.exports = router;
