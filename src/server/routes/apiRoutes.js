const express = require('express');
const router = express.Router();
// Destructure the apiKeyAuth function from the module
const { apiKeyAuth } = require('../middleware/apiKeyAuth');
const { 
  generateApiKey, 
  getUserApiKeys, 
  revokeApiKey 
} = require('../utils/apiKeys');

// Public route - no authentication needed
router.get('/status', (req, res) => {
  res.json({ 
    status: 'API is running', 
    time: new Date().toISOString() 
  });
});

// Generate a new API key (requires user authentication)
// Note: This would typically use your existing auth middleware
router.post('/keys', async (req, res) => {
  try {
    // In production, get userId from your auth middleware
    // For demo purposes, we're getting it from the request body
    const { userId, name, expiresIn } = req.body;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID is required' 
      });
    }
    
    const newKey = await generateApiKey(userId, name, expiresIn);
    
    res.status(201).json({
      success: true,
      message: 'API key generated successfully',
      data: newKey
    });
  } catch (error) {
    console.error('Error generating API key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate API key'
    });
  }
});

// Get all API keys for a user (requires authentication)
router.get('/keys', async (req, res) => {
  try {
    // In production, get userId from your auth middleware
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }
    
    const keys = await getUserApiKeys(userId);
    
    res.json({
      success: true,
      data: keys
    });
  } catch (error) {
    console.error('Error retrieving API keys:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve API keys'
    });
  }
});

// Revoke an API key (requires authentication)
router.delete('/keys/:keyId', async (req, res) => {
  try {
    const { keyId } = req.params;
    
    if (!keyId) {
      return res.status(400).json({
        success: false,
        message: 'Key ID is required'
      });
    }
    
    await revokeApiKey(keyId);
    
    res.json({
      success: true,
      message: 'API key revoked successfully'
    });
  } catch (error) {
    console.error('Error revoking API key:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke API key'
    });
  }
});

// Protected routes - requires API key authentication
// Apply the middleware to all routes with the '/protected' prefix
router.use('/protected', apiKeyAuth);

// Basic protected route
router.get('/protected', (req, res) => {
  res.json({
    success: true,
    message: 'You have access to this protected resource',
    user: req.user
  });
});

// Protected route to get user data
router.get('/protected/user', (req, res) => {
  res.json({
    success: true,
    message: 'User data retrieved successfully',
    data: {
      userId: req.user.userId,
      name: req.user.name || 'User',
      email: req.user.email || 'email@example.com'
    }
  });
});

// Protected route for data operations
router.post('/protected/data', (req, res) => {
  const { data } = req.body;
  
  if (!data) {
    return res.status(400).json({
      success: false,
      message: 'Data is required'
    });
  }
  
  // Process the data (this would be your business logic)
  const processedData = {
    receivedAt: new Date().toISOString(),
    processedBy: req.user.userId,
    result: `Processed: ${JSON.stringify(data)}`
  };
  
  res.json({
    success: true,
    message: 'Data processed successfully',
    data: processedData
  });
});

module.exports = router; 