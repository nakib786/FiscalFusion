/**
 * Authentication routes
 */
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login route
router.post('/login', authController.login);

// Register route
router.post('/register', authController.register);

// Verify token route
router.get('/verify', authController.verifyToken);

module.exports = router; 