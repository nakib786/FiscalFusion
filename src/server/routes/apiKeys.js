const express = require('express');
const router = express.Router();
const { 
  generateApiKey, 
  getUserApiKeys, 
  revokeApiKey 
} = require('../utils/apiKeys');
const auth = require('../middleware/auth'); // Regular user authentication

// Get all API keys for the authenticated user
router.get('/', auth, async (req, res) => {
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
      message: 'Failed to fetch API keys'
    });
  }
});

// Generate a new API key
router.post('/', auth, async (req, res) => {
  try {
    const { name, expiration } = req.body;
    const userId = req.user.id;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'API key name is required'
      });
    }
    
    // Convert expiration string to Date if provided
    let expirationDate = null;
    if (expiration) {
      expirationDate = new Date(expiration);
      
      // Validate the expiration date
      if (isNaN(expirationDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expiration date format'
        });
      }
    }
    
    const apiKeyData = await generateApiKey(userId, name, expirationDate);
    
    return res.status(201).json({
      success: true,
      data: apiKeyData,
      message: 'API key generated successfully. Store this key safely as it won\'t be shown again.'
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate API key'
    });
  }
});

// Revoke an API key
router.delete('/:keyId', auth, async (req, res) => {
  try {
    const keyId = req.params.keyId;
    const userId = req.user.id;
    
    const result = await revokeApiKey(keyId);
    
    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.message || 'API key not found'
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
      message: 'Failed to revoke API key'
    });
  }
});

module.exports = router; 