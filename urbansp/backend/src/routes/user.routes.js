const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { registerValidation, loginValidation } = require('../validators/expressValidator');
const { protect, adminOnly } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.post('/register', registerValidation, userController.register);
router.post('/login', loginValidation, userController.login);
router.get('/profile', protect, userController.profile);
router.put('/profile', protect, upload.single('avatar'), userController.updateProfile);

// Admin
router.get('/', protect, adminOnly, userController.getAllUsers);
router.put('/role/:id', protect, adminOnly, userController.updateUserRole);

module.exports = router;
