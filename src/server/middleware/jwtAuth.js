/**
 * JWT Authentication Middleware
 * Handles token validation and user authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

/**
 * Middleware to verify JWT token
 * Attaches user to request object if token is valid
 */
exports.verifyToken = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided'
      });
    }
    
    // Extract token from header
    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Find user by ID and attach to request
    const user = await User.findById(decoded.sub);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token: User not found'
      });
    }
    
    // Remove password from user object
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;
    
    // Attach user to request
    req.user = userWithoutPassword;
    
    // Continue to next middleware or route handler
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    console.error('JWT Verification Error:', error);
    res.status(500).json({
      success: false,
      message: 'Token verification failed'
    });
  }
};

/**
 * Middleware to check if user has required roles
 * Must be used after verifyToken middleware
 * 
 * @param {Array} roles - Array of roles that can access the route
 */
exports.hasRole = (roles) => {
  return (req, res, next) => {
    // Ensure verifyToken middleware was run
    if (!req.user) {
      return res.status(500).json({
        success: false,
        message: 'Server error: User not authenticated'
      });
    }
    
    // Check if user has any of the required roles
    const hasPermission = req.user.roles.some(role => roles.includes(role));
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: Insufficient permissions'
      });
    }
    
    // User has permission, continue
    next();
  };
};

module.exports = {
  verifyToken,
  hasRole
}; 