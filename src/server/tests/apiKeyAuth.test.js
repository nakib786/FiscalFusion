const { apiKeyAuth, optionalApiKeyAuth } = require('../middleware/apiKeyAuth');
const { validateApiKey } = require('../utils/apiKeys');

// Mock the validateApiKey function
jest.mock('../utils/apiKeys', () => ({
  validateApiKey: jest.fn()
}));

describe('API Key Authentication Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
    
    // Create mock request, response, and next function
    req = {
      headers: {},
      query: {}
    };
    
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    
    next = jest.fn();
  });

  describe('apiKeyAuth middleware', () => {
    test('should return 401 if no API key is provided', async () => {
      await apiKeyAuth(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'API key is required for authentication'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should authenticate with API key from Authorization header', async () => {
      req.headers.authorization = 'Bearer test-api-key';
      validateApiKey.mockResolvedValue({ userId: 'user123' });
      
      await apiKeyAuth(req, res, next);
      
      expect(validateApiKey).toHaveBeenCalledWith('test-api-key');
      expect(req.user).toEqual({ userId: 'user123' });
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    test('should authenticate with API key from X-API-Key header', async () => {
      req.headers['x-api-key'] = 'test-api-key';
      validateApiKey.mockResolvedValue({ userId: 'user123' });
      
      await apiKeyAuth(req, res, next);
      
      expect(validateApiKey).toHaveBeenCalledWith('test-api-key');
      expect(req.user).toEqual({ userId: 'user123' });
      expect(next).toHaveBeenCalled();
    });

    test('should authenticate with API key from query parameter', async () => {
      req.query.api_key = 'test-api-key';
      validateApiKey.mockResolvedValue({ userId: 'user123' });
      
      await apiKeyAuth(req, res, next);
      
      expect(validateApiKey).toHaveBeenCalledWith('test-api-key');
      expect(req.user).toEqual({ userId: 'user123' });
      expect(next).toHaveBeenCalled();
    });

    test('should return 401 if API key is invalid', async () => {
      req.headers['x-api-key'] = 'invalid-api-key';
      validateApiKey.mockResolvedValue(null);
      
      await apiKeyAuth(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid or expired API key'
      });
      expect(next).not.toHaveBeenCalled();
    });

    test('should return 500 if authentication throws an error', async () => {
      req.headers['x-api-key'] = 'test-api-key';
      validateApiKey.mockRejectedValue(new Error('Database error'));
      
      await apiKeyAuth(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Authentication error'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalApiKeyAuth middleware', () => {
    test('should continue to next middleware if no API key is provided', async () => {
      await optionalApiKeyAuth(req, res, next);
      
      expect(validateApiKey).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
      expect(req.user).toBeUndefined();
    });

    test('should attach user to request if valid API key is provided', async () => {
      req.headers['x-api-key'] = 'test-api-key';
      validateApiKey.mockResolvedValue({ userId: 'user123' });
      
      await optionalApiKeyAuth(req, res, next);
      
      expect(validateApiKey).toHaveBeenCalledWith('test-api-key');
      expect(req.user).toEqual({ userId: 'user123' });
      expect(next).toHaveBeenCalled();
    });

    test('should continue to next middleware even if API key is invalid', async () => {
      req.headers['x-api-key'] = 'invalid-api-key';
      validateApiKey.mockResolvedValue(null);
      
      await optionalApiKeyAuth(req, res, next);
      
      expect(validateApiKey).toHaveBeenCalledWith('invalid-api-key');
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });

    test('should continue to next middleware even if authentication throws an error', async () => {
      req.headers['x-api-key'] = 'test-api-key';
      validateApiKey.mockRejectedValue(new Error('Database error'));
      
      await optionalApiKeyAuth(req, res, next);
      
      expect(validateApiKey).toHaveBeenCalledWith('test-api-key');
      expect(req.user).toBeUndefined();
      expect(next).toHaveBeenCalled();
    });
  });
}); 