
const userService = require('../services/userService');
const storeService = require('../services/storeService');
const db = require('../config/db');


const getDashboardStats = async (req, res) => {
    try {
        const userCountPromise = db.query('SELECT COUNT(*) FROM users');
        const storeCountPromise = db.query('SELECT COUNT(*) FROM stores');
        const ratingCountPromise = db.query('SELECT COUNT(*) FROM ratings');

        const [userResult, storeResult, ratingResult] = await Promise.all([
            userCountPromise,
            storeCountPromise,
            ratingCountPromise,
        ]);

        res.status(200).json({
            totalUsers: parseInt(userResult.rows[0].count, 10),
            totalStores: parseInt(storeResult.rows[0].count, 10),
            totalRatings: parseInt(ratingResult.rows[0].count, 10),
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ message: 'Server error fetching dashboard stats.' });
    }
};


const createUser = async (req, res) => {
    
    const { name, email, password, address, role } = req.body;

    
    const validRoles = ['System Administrator', 'Normal User', 'Store Owner'];
    if (!role || !validRoles.includes(role)) {
        return res.status(400).json({ message: 'A valid role is required.' });
    }

    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email is already registered.' });
        }

        const newUser = await userService.createUser(name, email, password, address, role);
        res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (error) {
        console.error('Admin create user error:', error);
        res.status(500).json({ message: 'Server error creating user.' });
    }
};

const getAllUsers = async (req, res) => {
    try {
        
        const filters = {
            name: req.query.name,
            email: req.query.email,
            address: req.query.address,
            role: req.query.role,
        };
        const sort = {
            field: req.query.sort_field,
            order: req.query.sort_order,
        };

        
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        const users = await userService.getAllUsers(filters, sort);
        res.status(200).json(users);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Server error fetching users.' });
    }
};


const createStore = async (req, res) => {
    const { name, email, address, owner_id } = req.body;

    try {
        
        const owner = await userService.findUserById(owner_id);
        if (!owner || owner.role !== 'Store Owner') {
            return res.status(400).json({ message: 'Provided owner_id is not a valid Store Owner.' });
        }

        
        const existingStore = await storeService.findStoreByEmail(email);
        if (existingStore) {
            return res.status(409).json({ message: 'A store with this email already exists.' });
        }

        const newStore = await storeService.createStore(name, email, address, owner_id);
        res.status(201).json({ message: 'Store created successfully.', store: newStore });
    } catch (error) {
        console.error('Admin create store error:', error);
        res.status(500).json({ message: 'Server error creating store.' });
    }
};

const getAllStores = async (req, res) => {
    try {
        const filters = {
            name: req.query.name,
            address: req.query.address,
        };
        const sort = {
            field: req.query.sort_field,
            order: req.query.sort_order,
        };
        Object.keys(filters).forEach(key => filters[key] === undefined && delete filters[key]);

        const stores = await storeService.getAllStoresWithRatings(filters, sort);
        res.status(200).json(stores);
    } catch (error) {
        console.error('Get all stores error:', error);
        res.status(500).json({ message: 'Server error fetching stores.' });
    }
};

module.exports = {
    getDashboardStats,
    createUser,
    getAllUsers,
    createStore,
    getAllStores,
};