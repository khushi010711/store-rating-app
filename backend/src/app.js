// src/app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic Route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the FullStack Intern Coding Challenge API!');
});

// Import and use routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const storeRoutes = require('./routes/storeRoutes');   
const ratingRoutes = require('./routes/ratingRoutes');
const storeOwnerRoutes = require('./routes/storeOwnerRoutes');



app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/stores', storeRoutes);   
app.use('/api/ratings/stores', ratingRoutes);
app.use('/api/store-owner', storeOwnerRoutes); 



// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Database: ${process.env.DB_DATABASE}`);
});

module.exports = app;