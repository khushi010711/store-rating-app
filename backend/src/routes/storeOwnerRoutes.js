// src/routes/storeOwnerRoutes.js
const express = require('express');
const router = express.Router();
const storeOwnerController = require('../controllers/storeOwnerController');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');

// All routes in this file are protected and only accessible by 'Store Owner'
router.use(authenticateToken);
router.use(checkRole(['Store Owner']));

// Define the route for the dashboard
router.get('/dashboard', storeOwnerController.getDashboard);

module.exports = router;