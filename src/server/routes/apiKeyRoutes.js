const express = require('express');
const router = express.Router();
const { generateApiKey, getUserApiKeys, revokeApiKey } = require('../utils/apiKeys');
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const authMiddleware = require('../middleware/auth'); // Assuming you have standard auth middleware

// Generate a new API key for the authenticated user
router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, expiration } = req.body;
    
    const apiKeyData = await generateApiKey(userId, name, expiration);
    
    // Return the API key in the response
    // Note: This is the only time the full API key will be shown to the user
    return res.status(201).json({
      success: true,
      message: 'API key generated successfully',
      data: apiKeyData
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate API key',
      error: error.message
    });
  }
});

// Get all API keys for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const apiKeys = await getUserApiKeys(userId);
    
    return res.status(200).json({
      success: true,
      data: apiKeys
    });
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch API keys',
      error: error.message
    });
  }
});

// Revoke an API key
router.delete('/:apiKey', authMiddleware, async (req, res) => {
  try {
    const { apiKey } = req.params;
    const result = await revokeApiKey(apiKey);
    
    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message || 'Failed to revoke API key'
      });
    }
    
    return res.status(200).json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to revoke API key',
      error: error.message
    });
  }
});

// Test route to verify API key authentication
router.get('/test', apiKeyAuth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'API key is valid',
    userData: req.user
  });
});

module.exports = router; 