const { validateApiKey } = require('../utils/apiKeys');

/**
 * Middleware to authenticate requests using API keys
 * Looks for an API key in:
 * 1. Authorization header (Bearer token)
 * 2. X-API-Key header
 * 3. api_key query parameter
 */
const apiKeyAuth = async (req, res, next) => {
  try {
    // Extract API key from request
    const authHeader = req.headers.authorization;
    const apiKeyHeader = req.headers['x-api-key'];
    const queryApiKey = req.query.api_key;
    
    // Get the API key from one of the possible locations
    let apiKey;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      // From Authorization header
      apiKey = authHeader.substring(7);
    } else if (apiKeyHeader) {
      // From X-API-Key header
      apiKey = apiKeyHeader;
    } else if (queryApiKey) {
      // From query parameter
      apiKey = queryApiKey;
    }
    
    if (!apiKey) {
      return res.status(401).json({
        success: false,
        message: 'API key is required for authentication'
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
    
    // Attach user info to the request object for use in route handlers
    req.user = user;
    
    // Continue to the next middleware or route handler
    next();
  } catch (error) {
    console.error('API key authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

// Optional middleware that tries to authenticate with API key
// but continues even if no key is provided or key is invalid
const optionalApiKeyAuth = async (req, res, next) => {
  // Extract API key from header or query parameter
  const apiKey = 
    req.headers['x-api-key'] || 
    req.query.api_key ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ') 
      ? req.headers.authorization.split(' ')[1] 
      : null);
  
  if (apiKey) {
    try {
      // Validate the API key
      const userData = await validateApiKey(apiKey);
      
      if (userData) {
        // Attach user data to request object
        req.user = userData;
      }
    } catch (error) {
      console.error('Optional API key authentication error:', error);
    }
  }
  
  // Always proceed to the next middleware/route handler
  next();
};

module.exports = {
  apiKeyAuth,
  optionalApiKeyAuth
}; 