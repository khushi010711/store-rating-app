const validateSignup = (req, res, next) => {
    const { name, email, password, address } = req.body;

    // Name: Min 20 characters, Max 60 characters.
    if (!name || name.length < 20 || name.length > 60) {
        return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
    }

    // Email: Must follow standard email validation rules.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    // Password: 8-16 characters, must include at least one uppercase letter and one special character.
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    if (!password || !passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character (!@#$%^&*).'
        });
    }

    // Address: Max 400 characters.
    if (address && address.length > 400) {
        return res.status(400).json({ message: 'Address cannot exceed 400 characters.' });
    }
    if (!address || address.trim() === '') {
        return res.status(400).json({ message: 'Address is required.' });
    }


    next(); // If all validations pass, proceed to the next middleware/controller
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required for login.' });
    }

    next();
};

const validateStore = (req, res, next) => {
    const { name, email, address, owner_id } = req.body;

    // Name: Required
    if (!name || name.trim() === '') {
        return res.status(400).json({ message: 'Store name is required.' });
    }

    // Email: Must follow standard email validation rules.
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address for the store.' });
    }

    // Address: Max 400 characters.
    if (!address || address.trim() === '' || address.length > 400) {
        return res.status(400).json({ message: 'Store address is required and cannot exceed 400 characters.' });
    }

    // Owner ID: Required (assuming it's passed during store creation by admin)
    if (!owner_id) {
        return res.status(400).json({ message: 'Store owner ID is required.' });
    }

    next();
};

const validateUserUpdate = (req, res, next) => {
    const { name, email, password, address, role } = req.body;

    if (name && (name.length < 20 || name.length > 60)) {
        return res.status(400).json({ message: 'Name must be between 20 and 60 characters.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email && !emailRegex.test(email)) {
        return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,16}$)/;
    if (password && !passwordRegex.test(password)) {
        return res.status(400).json({
            message: 'Password must be 8-16 characters long and include at least one uppercase letter and one special character (!@#$%^&*).'
        });
    }

    if (address && address.length > 400) {
        return res.status(400).json({ message: 'Address cannot exceed 400 characters.' });
    }

    const validRoles = ['System Administrator', 'Normal User', 'Store Owner'];
    if (role && !validRoles.includes(role)) {
        return res.status(400).json({ message: `Invalid role. Must be one of: ${validRoles.join(', ')}` });
    }

    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'No fields provided for update.' });
    }

    next();
};


const validateRating = (req, res, next) => {
    const { rating_value } = req.body;

    if (rating_value === undefined || rating_value === null || rating_value < 1 || rating_value > 5) {
        return res.status(400).json({ message: 'Rating value must be between 1 and 5.' });
    }

    next();
};


module.exports = {
    validateSignup,
    validateLogin,
    validateStore,
    validateUserUpdate,
    validateRating
};