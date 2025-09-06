const db = require('../config/db');
const bcrypt = require('bcryptjs');

const createUser = async (name, email, password, address, role = 'Normal User') => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (name, email, password, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, address, role, created_at';
    const values = [name, email, hashedPassword, address, role];
    const { rows } = await db.query(query, values);
    return rows[0];
};

const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
};

const findUserById = async (id) => {
    const query = 'SELECT id, name, email, address, role, created_at, updated_at FROM users WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    return rows[0];
};

const findUserWithPasswordById = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

const updateUserPassword = async (userId, newPassword) => {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const query = 'UPDATE users SET password = $1, updated_at = NOW() WHERE id = $2 RETURNING id';
    const { rows } = await db.query(query, [hashedPassword, userId]);
    return rows[0];
};

const getAllUsers = async (filters = {}, sort = {}) => {
    // This query is now more advanced. It joins with stores and ratings.
    let query = `
        SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            u.role,
            u.created_at,
            u.updated_at,
            -- This line calculates the average rating ONLY for users who are store owners.
            -- For other users, this will be null.
            AVG(r.rating_value) AS average_store_rating
        FROM
            users u
        LEFT JOIN
            stores s ON u.id = s.owner_id
        LEFT JOIN
            ratings r ON s.id = r.store_id
        WHERE 1=1
    `;
    const values = [];
    let paramIndex = 1;

    // Apply filters (using "u." prefix to be specific)
    if (filters.name) {
        query += ` AND u.name ILIKE $${paramIndex++}`;
        values.push(`%${filters.name}%`);
    }
    if (filters.email) {
        query += ` AND u.email ILIKE $${paramIndex++}`;
        values.push(`%${filters.email}%`);
    }
    if (filters.address) {
        query += ` AND u.address ILIKE $${paramIndex++}`;
        values.push(`%${filters.address}%`);
    }
    if (filters.role) {
        query += ` AND u.role = $${paramIndex++}`;
        values.push(filters.role);
    }

    // We MUST group by the user because we are using an aggregate function (AVG)
    query += ` GROUP BY u.id`;

    // Apply sorting
    const sortField = sort.field || 'name';
    const sortOrder = sort.order && sort.order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';
    // Handle sorting by the new calculated rating field
    const sortColumn = sortField === 'average_store_rating' ? 'average_store_rating' : `u.${sortField}`;
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;

    const { rows } = await db.query(query, values);
    return rows;
};

const updateUser = async (userId, updateData) => {
    let query = 'UPDATE users SET updated_at = CURRENT_TIMESTAMP';
    const values = [];
    let paramIndex = 1;

    if (updateData.name) {
        query += `, name = $${paramIndex++}`;
        values.push(updateData.name);
    }
    if (updateData.email) {
        query += `, email = $${paramIndex++}`;
        values.push(updateData.email);
    }
    if (updateData.password) {
        const hashedPassword = await bcrypt.hash(updateData.password, 10);
        query += `, password = $${paramIndex++}`;
        values.push(hashedPassword);
    }
    if (updateData.address) {
        query += `, address = $${paramIndex++}`;
        values.push(updateData.address);
    }
    if (updateData.role) {
        query += `, role = $${paramIndex++}`;
        values.push(updateData.role);
    }

    if (values.length === 0) {
        return null; // No fields to update
    }

    query += ` WHERE id = $${paramIndex++} RETURNING id, name, email, address, role, updated_at`;
    values.push(userId);

    const { rows } = await db.query(query, values);
    return rows[0];
};

// Function to get user with store average rating if they are a Store Owner
const getUserWithStoreRating = async (userId) => {
    const query = `
        SELECT
            u.id,
            u.name,
            u.email,
            u.address,
            u.role,
            AVG(r.rating_value) AS average_store_rating
        FROM
            users u
        LEFT JOIN
            stores s ON u.id = s.owner_id
        LEFT JOIN
            ratings r ON s.id = r.store_id
        WHERE
            u.id = $1
        GROUP BY
            u.id, u.name, u.email, u.address, u.role;
    `;
    const { rows } = await db.query(query, [userId]);
    return rows[0];
};


module.exports = {
    createUser,
    findUserByEmail,
    findUserById,
    findUserWithPasswordById, 
    comparePassword,
    updateUserPassword,
    getAllUsers,
    updateUser,
    getUserWithStoreRating
};