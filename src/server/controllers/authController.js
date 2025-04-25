/**
 * Authentication Controller
 * Handles user authentication and JWT token generation
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * Login a user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required'
      });
    }
    
    // Find user by email
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Create JWT payload
    const payload = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      roles: user.roles || ['user']
    };
    
    // Sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Update last login
    await User.updateUser(user._id, { lastLogin: new Date() });
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      success: true,
      token: `Bearer ${token}`,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
    });
  }
};

/**
 * Register a new user
 */
const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, companyName } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email and password are required' 
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const userData = {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email.toLowerCase(),
      password: hashedPassword,
      companyName: companyName || '',
      roles: ['user'],
      permissions: ['read:own', 'write:own'],
      created: new Date(),
      updated: new Date()
    };
    
    const newUser = await User.createUser(userData);
    
    // Create JWT payload
    const payload = {
      id: newUser._id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      roles: newUser.roles
    };
    
    // Sign token
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return res.status(201).json({
      success: true,
      token: `Bearer ${token}`,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
};

/**
 * Verify JWT token and return user info
 */
const verifyToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided' 
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user from database
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          message: 'User not found' 
        });
      }
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;
      
      return res.status(200).json({
        success: true,
        user: userWithoutPassword
      });
    } catch (error) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error during token verification' 
    });
  }
};

/**
 * Get current user profile
 */
const getCurrentUser = async (req, res) => {
  // If user is not authenticated, return error
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }

  try {
    // Get user from database (should be populated in middleware)
    const user = req.dbUser;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database'
      });
    }
    
    // Return user information (omit sensitive information)
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        email_verified: user.email_verified,
        last_login: user.last_login,
        created_at: user.created_at
      }
    });
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving user information'
    });
  }
};

/**
 * Update user profile
 */
const updateUserProfile = async (req, res) => {
  // If user is not authenticated, return error
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }

  try {
    // Get user from database
    const user = req.dbUser;
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found in database'
      });
    }
    
    // Get update data from request
    const { name, picture, user_metadata } = req.body;
    
    // Update user profile
    const updatedUser = await User.updateUser(user._id.toString(), {
      name,
      picture,
      user_metadata
    });
    
    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        picture: updatedUser.picture,
        email_verified: updatedUser.email_verified,
        last_login: updatedUser.last_login,
        created_at: updatedUser.created_at
      }
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating user profile'
    });
  }
};

/**
 * Generate a JWT token for API access
 */
const generateApiToken = async (req, res) => {
  // If user is not authenticated, return error
  if (!req.oidc.isAuthenticated()) {
    return res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }

  try {
    const user = req.dbUser;
    
    // Create payload for JWT
    const payload = {
      sub: user._id.toString(),
      email: user.email,
      name: user.name
    };
    
    // Sign the JWT
    const token = jwt.sign(
      payload, 
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      success: true,
      token,
      expires_in: 86400 // 24 hours in seconds
    });
  } catch (error) {
    console.error('Error generating API token:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating API token'
    });
  }
};

module.exports = {
  getCurrentUser,
  updateUserProfile,
  generateApiToken,
  login,
  register,
  verifyToken
}; 