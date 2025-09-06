// src/routes/storeRoutes.js
const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { authenticateToken } = require('../middleware/authMiddleware');

// This route is for any authenticated user (Admin, Normal User, Store Owner) to view stores
router.get('/', authenticateToken, storeController.getStores);



// This route is for any authenticated user (Admin, Normal User, Store Owner) to view stores
router.get('/:id', authenticateToken, storeController.getStoreById);

module.exports = router;