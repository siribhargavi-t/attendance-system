const jwt = require('jsonwebtoken');

module.exports = function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const secret = process.env.JWT_SECRET || 'attendance_system_secret_key_2024';
    const decoded = jwt.verify(token, secret);
    req.user = decoded; // should contain id and role
    console.log("Token verified successfully for user:", decoded.id);
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};