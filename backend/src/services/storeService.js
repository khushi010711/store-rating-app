// src/services/storeService.js
const db = require('../config/db');

const createStore = async (name, email, address, ownerId) => {
    const query = 'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *';
    const values = [name, email, address, ownerId];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const findStoreByEmail = async (email) => {
    const query = 'SELECT * FROM stores WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
};

// Function to get all stores with their average rating
const getAllStoresWithRatings = async (filters = {}, sort = {}) => {
    let query = `
        SELECT
            s.id,
            s.name,
            s.email,
            s.address,
            s.owner_id,
            COALESCE(AVG(r.rating_value), 0) AS average_rating
        FROM
            stores s
        LEFT JOIN
            ratings r ON s.id = r.store_id
        WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    // Apply filters
    if (filters.name) {
        query += ` AND s.name ILIKE $${paramIndex++}`;
        values.push(`%${filters.name}%`);
    }
    if (filters.address) {
        query += ` AND s.address ILIKE $${paramIndex++}`;
        values.push(`%${filters.address}%`);
    }

    query += ' GROUP BY s.id';

    // Apply sorting
    const sortField = sort.field || 'name'; // Default sort by name
    const sortOrder = sort.order && sort.order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField === 'rating' ? 'average_rating' : `s.${sortField}`} ${sortOrder}`;


    const { rows } = await db.query(query, values);
    return rows;
};



const getStoresForUser = async (userId, filters = {}, sort = {}) => {
    let query = `
        SELECT
            s.id,
            s.name,
            s.address,
            s.owner_id,
            s.image_url,      -- <-- THIS LINE IS REQUIRED
            s.description,    -- <-- THIS LINE IS REQUIRED
            COALESCE(AVG(all_ratings.rating_value), 0) AS overall_rating,
            user_rating.rating_value AS user_submitted_rating
        FROM
            stores s
        LEFT JOIN
            ratings AS all_ratings ON s.id = all_ratings.store_id
        LEFT JOIN
            ratings AS user_rating ON s.id = user_rating.store_id AND user_rating.user_id = $1
        WHERE 1=1
    `;
    const values = [userId];
    let paramIndex = 2;

    if (filters.name) {
        query += ` AND s.name ILIKE $${paramIndex++}`;
        values.push(`%${filters.name}%`);
    }
    if (filters.address) {
        query += ` AND s.address ILIKE $${paramIndex++}`;
        values.push(`%${filters.address}%`);
    }

    query += ' GROUP BY s.id, user_rating.rating_value';

    const sortField = sort.field || 'name';
    const sortOrder = sort.order && sort.order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    query += ` ORDER BY ${sortField === 'rating' ? 'overall_rating' : `s.${sortField}`} ${sortOrder}`;

    const { rows } = await db.query(query, values);
    return rows;
};


const getStoreDashboard = async (ownerId) => {


    const query = `
        SELECT
            s.id AS store_id,
            s.name AS store_name,
            -- Calculate the average rating for this store
            COALESCE(AVG(r.rating_value), 0) AS average_rating,
            -- Aggregate all the user names and their ratings into a JSON array
            COALESCE(
                json_agg(
                    json_build_object(
                        'user_id', u.id,
                        'name', u.name,
                        'rating_given', r.rating_value
                    )
                ) FILTER (WHERE u.id IS NOT NULL), '[]'::json
            ) AS users_who_rated
        FROM
            stores s
        LEFT JOIN
            ratings r ON s.id = r.store_id
        LEFT JOIN
            users u ON r.user_id = u.id
        WHERE
            s.owner_id = $1
        GROUP BY
            s.id;
    `;

    const { rows } = await db.query(query, [ownerId]);
    return rows[0]; 
};




const getStoreById = async (storeId, userId) => {
  
  const query = `
    SELECT
        s.id,
        s.name,
        s.address,
        s.owner_id,
        s.image_url,
        s.description,
        COALESCE(AVG(all_ratings.rating_value), 0) AS overall_rating,
        user_rating.rating_value AS user_submitted_rating
    FROM
        stores s
    LEFT JOIN
        ratings AS all_ratings ON s.id = all_ratings.store_id
    LEFT JOIN
        ratings AS user_rating ON s.id = user_rating.store_id AND user_rating.user_id = $2
    WHERE
        s.id = $1
    GROUP BY
        s.id, user_rating.rating_value;
  `;
  
  const { rows } = await db.query(query, [storeId, userId]);
  return rows[0]; 
};




module.exports = {
    createStore,
    findStoreByEmail,
    getAllStoresWithRatings,
    getStoresForUser,
    getStoreDashboard,
    getStoreById,
};