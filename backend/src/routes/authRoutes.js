// src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateSignup, validateLogin, validateUserUpdate } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/authMiddleware');

// Public routes
router.post('/signup', validateSignup, authController.signup);
router.post('/login', validateLogin, authController.login);

// Protected route for changing password (requires authentication)
router.patch('/change-password', authenticateToken, validateUserUpdate, authController.changePassword);


module.exports = router;