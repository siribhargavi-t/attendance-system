const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // Get token from header
    const authHeader = req.header('Authorization');

    // Check if Authorization header exists
    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'No token, authorization denied' });
    }

    // Check if the token is in the correct 'Bearer <token>' format
    const tokenParts = authHeader.split(' ');
    if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
        return res.status(401).json({ success: false, message: 'Token is not valid' });
    }

    const token = tokenParts[1];

    try {
        // Verify token using the secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');

        // Attach the decoded payload correctly regardless of nested vs flat format
        req.user = decoded.user ? decoded.user : decoded;
        
        // Allow the request to proceed to the next middleware or route handler
        next();
    } catch (err) {
        // Return unauthorized error if token is invalid
        res.status(401).json({ success: false, message: 'Token is not valid' });
    }
};


