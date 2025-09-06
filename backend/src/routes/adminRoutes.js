// src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');
const { validateSignup, validateStore } = require('../middleware/validation');

// All routes in this file will be protected and accessible only by 'System Administrator'
router.use(authenticateToken);
router.use(checkRole(['System Administrator']));

// Dashboard
router.get('/dashboard/stats', adminController.getDashboardStats);

// User Management
router.post('/users', validateSignup, adminController.createUser); // Use signup validation for creating users
router.get('/users', adminController.getAllUsers);

// Store Management
router.post('/stores', validateStore, adminController.createStore);
router.get('/stores', adminController.getAllStores);

module.exports = router;