// src/services/ratingService.js
const db = require('../config/db');

const submitOrUpdateRating = async (userId, storeId, ratingValue) => {
    const query = `
        INSERT INTO ratings (user_id, store_id, rating_value)
        VALUES ($1, $2, $3)
        ON CONFLICT (user_id, store_id)
        DO UPDATE SET rating_value = EXCLUDED.rating_value, updated_at = CURRENT_TIMESTAMP
        RETURNING *;
    `;
    // This SQL command is very efficient. It tries to INSERT a new rating.


    const values = [userId, storeId, ratingValue];
    const { rows } = await db.query(query, values);
    return rows[0];
};

module.exports = {
    submitOrUpdateRating,
};