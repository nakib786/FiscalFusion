const { validateApiKey } = require('../utils/apiKeys');

/**
 * Middleware to authenticate requests using API keys
 * 
 * API keys can be provided in:
 * 1. Authorization header: "Bearer {api_key}"
 * 2. X-API-Key header
 * 3. Query parameter: ?api_key={api_key}
 */
const apiKeyAuth = async (req, res, next) => {
  try {
    let apiKey = null;
    
    // Check Authorization header (Bearer token)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      apiKey = authHeader.substring(7);
    }
    
    // Check X-API-Key header
    if (!apiKey && req.headers['x-api-key']) {
      apiKey = req.headers['x-api-key'];
    }
    
    // Check query parameter
    if (!apiKey && req.query.api_key) {
      apiKey = req.query.api_key;
    }
    
    // If no API key found, return unauthorized
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required'
      });
    }
    
    // Validate the API key
    const user = await validateApiKey(apiKey);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired API key'
      });
    }
    
    // Attach user info to request object
    req.user = user;
    
    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error('API authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

module.exports = apiKeyAuth; 