const userService = require('../services/userService');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const signup = async (req, res) => {
    const { name, email, password, address } = req.body;

    try {
        const existingUser = await userService.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered.' });
        }

        const newUser = await userService.createUser(name, email, password, address, 'Normal User');
        const token = generateToken(newUser);

        res.status(201).json({
            message: 'User registered successfully.',
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
            token,
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during registration.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userService.findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const isMatch = await userService.comparePassword(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials,expected password:' });
        }

        const token = generateToken(user);

        res.status(200).json({
            message: 'Logged in successfully.',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token,
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login.' });
    }
};

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user.id; // From authenticateToken middleware

    try {
        const user = await userService.findUserWithPasswordById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isMatch = await userService.comparePassword(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect old password.' });
        }

        
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
        if (!newPassword || !passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message: 'New password must be 8-16 characters long and include at least one uppercase letter and one special character (!@#$%^&*).'
            });
        }

        await userService.updateUserPassword(userId, newPassword);
        res.status(200).json({ message: 'Password updated successfully.' });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error during password update.' });
    }
};


module.exports = {
    signup,
    login,
    changePassword
};