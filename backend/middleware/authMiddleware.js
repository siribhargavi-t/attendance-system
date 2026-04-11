const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from the token payload
        // The 'select(-password)' ensures the password hash is not attached to the request object
        req.user = await User.findById(decoded.user.id).select('-password');
        
        console.log('Auth Middleware User:', req.user); // DEBUG LOG

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// Grant access to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403); // 403 Forbidden is more appropriate than 401 Unauthorized
            throw new Error(`User role ${req.user ? req.user.role : 'guest'} is not authorized to access this route`);
        }
        next();
    };
};

module.exports = { protect, authorize };


