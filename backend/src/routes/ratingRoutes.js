// src/routes/ratingRoutes.js
const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { authenticateToken, checkRole } = require('../middleware/authMiddleware');
const { validateRating } = require('../middleware/validation');

// We combine the routes here. A user can POST (create) or PUT (update) a rating on a store.

router.post(
    '/:storeId',
    authenticateToken,
    checkRole(['Normal User']),
    validateRating,
    ratingController.submitRating
);

router.put(
    '/:storeId',
    authenticateToken,
    checkRole(['Normal User']),
    validateRating,
    ratingController.submitRating
);

module.exports = router;