const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

// In-memory user database (would be replaced with a real DB)
let users = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    password: '$2b$10$x5d/BN6Ys5YUMeOXUTZSK.MBumJYZpAM.MrJb8VDSxUhEHkQjXuuS', // "password123"
    roles: ['admin', 'user'],
    permissions: ['read:all', 'write:all'],
    companyName: 'FiscalFusion Inc.',
    created: new Date().toISOString()
  }
];

// In-memory reset token storage (would be in a database in production)
let resetTokens = {}; // { email: { token: '123456', expires: Date, verified: false } }

// Helper function to generate a JWT token
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    roles: user.roles
  };
  
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', { expiresIn: '24h' });
};

// Helper function to generate a password reset token
const generateResetToken = () => {
  // Generate a 6-digit code
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Authenticate middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin middleware
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles || !req.user.roles.includes('admin')) {
    return res.status(403).json({ message: 'Unauthorized - Admin access required' });
  }
  next();
};

// Route to register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, companyName, role, roles } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.email === email.toLowerCase())) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Determine user roles
    let userRoles = ['user'];
    
    // If roles array is provided (from admin panel), use that
    if (roles && Array.isArray(roles)) {
      userRoles = roles;
    } 
    // Otherwise, if a single role is provided, add it
    else if (role && role !== 'user') {
      userRoles.push(role);
    }
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      email: email.toLowerCase(),
      firstName,
      lastName,
      password: hashedPassword,
      roles: userRoles,
      permissions: userRoles.includes('admin') ? ['read:all', 'write:all'] : ['read:own', 'write:own'],
      companyName,
      created: new Date().toISOString()
    };
    
    // Add user to database
    users.push(newUser);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({ 
      message: 'User registered successfully',
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Route to login a user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      success: true,
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Route to verify a token
router.get('/verify', authenticate, (req, res) => {
  try {
    // Find user from decoded token
    const userId = req.user.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json({ 
      success: true,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(500).json({ message: 'Server error verifying token' });
  }
});

// Route to get current user profile
router.get('/profile', authenticate, (req, res) => {
  try {
    const userId = req.user.id;
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error retrieving profile' });
  }
});

// Route to update user profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, companyName, email, currentPassword, newPassword } = req.body;
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[userIndex];
    
    // Create updated user object
    const updatedUser = { ...user };
    
    // Update fields if provided
    if (firstName) updatedUser.firstName = firstName;
    if (lastName) updatedUser.lastName = lastName;
    if (companyName) updatedUser.companyName = companyName;
    
    // Update email if provided and not already used
    if (email && email.toLowerCase() !== user.email) {
      // Check if new email already exists
      if (users.some(u => u.id !== userId && u.email === email.toLowerCase())) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      updatedUser.email = email.toLowerCase();
    }
    
    // Update password if provided
    if (currentPassword && newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(newPassword, salt);
    }
    
    // Update user in database
    users[userIndex] = updatedUser;
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json({ 
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
});

// Admin route to get all users
router.get('/users', authenticate, isAdmin, (req, res) => {
  try {
    // Return users without passwords
    const usersWithoutPasswords = users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
    
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error retrieving users' });
  }
});

// Admin route to update a user
router.put('/users/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstName, lastName, email, companyName, roles } = req.body;
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const user = users[userIndex];
    
    // Create updated user object
    const updatedUser = { ...user };
    
    // Update fields if provided
    if (firstName) updatedUser.firstName = firstName;
    if (lastName) updatedUser.lastName = lastName;
    if (companyName !== undefined) updatedUser.companyName = companyName;
    
    // Update roles if provided
    if (roles && Array.isArray(roles)) {
      updatedUser.roles = roles;
      
      // Update permissions based on roles
      if (roles.includes('admin')) {
        updatedUser.permissions = ['read:all', 'write:all'];
      } else {
        updatedUser.permissions = ['read:own', 'write:own'];
      }
    }
    
    // Update email if provided and not already used
    if (email && email.toLowerCase() !== user.email) {
      // Check if new email already exists
      if (users.some(u => u.id !== userId && u.email === email.toLowerCase())) {
        return res.status(400).json({ message: 'Email already in use' });
      }
      
      updatedUser.email = email.toLowerCase();
    }
    
    // Update user in database
    users[userIndex] = updatedUser;
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = updatedUser;
    
    res.json({ 
      message: 'User updated successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('User update error:', error);
    res.status(500).json({ message: 'Server error updating user' });
  }
});

// Admin route to delete a user
router.delete('/users/:id', authenticate, isAdmin, (req, res) => {
  try {
    const userId = req.params.id;
    
    // Prevent admin from deleting themselves
    if (userId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Remove user from database
    users.splice(userIndex, 1);
    
    res.json({ 
      message: 'User deleted successfully',
      success: true
    });
  } catch (error) {
    console.error('User deletion error:', error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
});

// Admin route to reset a user's password
router.post('/users/:id/reset-password', authenticate, isAdmin, async (req, res) => {
  try {
    const userId = req.params.id;
    
    // Find user
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate a temporary password
    const tempPassword = 'Reset' + Math.floor(100000 + Math.random() * 900000);
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);
    
    // Update user password
    users[userIndex].password = hashedPassword;
    users[userIndex].requirePasswordChange = true;
    
    res.json({ 
      message: 'Password reset successfully',
      tempPassword // In a real app, you would email this to the user
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

// Route to request a password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Check if email exists
    const user = users.find(u => u.email === email.toLowerCase());
    
    if (!user) {
      // For security reasons, still return success even if no user found
      return res.json({ 
        message: 'If your email exists in our system, you will receive a reset code shortly',
        success: true
      });
    }
    
    // Generate reset token
    const resetToken = generateResetToken();
    
    // Store token with expiration (15 minutes)
    const expiration = new Date();
    expiration.setMinutes(expiration.getMinutes() + 15);
    
    resetTokens[email.toLowerCase()] = {
      token: resetToken,
      expires: expiration,
      verified: false
    };
    
    // In a real app, send an email with the token
    console.log(`Reset token for ${email}: ${resetToken}`);
    
    res.json({ 
      message: 'If your email exists in our system, you will receive a reset code shortly',
      success: true
      // In development, we can send the token for testing
      // Don't do this in production!
      // resetToken 
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error processing your request' });
  }
});

// Route to verify reset token
router.post('/verify-reset-token', async (req, res) => {
  try {
    const { email, token } = req.body;
    
    // Check if token exists and is valid
    const resetData = resetTokens[email.toLowerCase()];
    
    if (!resetData || resetData.token !== token) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }
    
    // Check if token is expired
    if (new Date() > new Date(resetData.expires)) {
      delete resetTokens[email.toLowerCase()];
      return res.status(400).json({ message: 'Reset code has expired' });
    }
    
    // Mark token as verified
    resetTokens[email.toLowerCase()].verified = true;
    
    res.json({
      message: 'Reset code verified successfully',
      success: true
    });
  } catch (error) {
    console.error('Verify reset token error:', error);
    res.status(500).json({ message: 'Server error verifying reset code' });
  }
});

// Route to reset password with token
router.post('/reset-password', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    // Check if token exists and is verified
    const resetData = resetTokens[email.toLowerCase()];
    
    if (!resetData || resetData.token !== token || !resetData.verified) {
      return res.status(400).json({ message: 'Invalid or expired reset code' });
    }
    
    // Check if token is expired
    if (new Date() > new Date(resetData.expires)) {
      delete resetTokens[email.toLowerCase()];
      return res.status(400).json({ message: 'Reset code has expired' });
    }
    
    // Find user
    const userIndex = users.findIndex(u => u.email === email.toLowerCase());
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update user password
    users[userIndex].password = hashedPassword;
    if (users[userIndex].requirePasswordChange) {
      users[userIndex].requirePasswordChange = false;
    }
    
    // Remove reset token
    delete resetTokens[email.toLowerCase()];
    
    res.json({
      message: 'Password reset successful',
      success: true
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error resetting password' });
  }
});

module.exports = router; 