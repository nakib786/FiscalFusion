const request = require('supertest');
const express = require('express');
const apiRoutes = require('../routes/apiRoutes');
const { validateApiKey } = require('../utils/apiKeys');

// Mock the validateApiKey function
jest.mock('../utils/apiKeys', () => ({
  validateApiKey: jest.fn(),
  generateApiKey: jest.fn(),
  getUserApiKeys: jest.fn(),
  revokeApiKey: jest.fn()
}));

describe('API Routes', () => {
  let app;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
    
    // Create a new Express app for each test
    app = express();
    app.use(express.json());
    app.use('/api', apiRoutes);
  });

  describe('Public Routes', () => {
    test('GET /api/status should return API status without authentication', async () => {
      const response = await request(app).get('/api/status');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'API is running');
      expect(response.body).toHaveProperty('time');
    });
  });

  describe('Protected Routes', () => {
    test('GET /api/protected should return 401 without API key', async () => {
      const response = await request(app).get('/api/protected');
      
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'API key is required for authentication');
    });

    test('GET /api/protected should return user data with valid API key', async () => {
      // Set up mock to return valid user data
      validateApiKey.mockResolvedValue({
        userId: 'user123',
        name: 'Test User'
      });
      
      const response = await request(app)
        .get('/api/protected')
        .set('X-API-Key', 'valid-api-key');
      
      expect(validateApiKey).toHaveBeenCalledWith('valid-api-key');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('userId', 'user123');
    });

    test('GET /api/protected should accept API key in Authorization header', async () => {
      // Set up mock to return valid user data
      validateApiKey.mockResolvedValue({
        userId: 'user123',
        name: 'Test User'
      });
      
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer valid-api-key');
      
      expect(validateApiKey).toHaveBeenCalledWith('valid-api-key');
      expect(response.status).toBe(200);
    });

    test('GET /api/protected should accept API key in query parameter', async () => {
      // Set up mock to return valid user data
      validateApiKey.mockResolvedValue({
        userId: 'user123',
        name: 'Test User'
      });
      
      const response = await request(app)
        .get('/api/protected?api_key=valid-api-key');
      
      expect(validateApiKey).toHaveBeenCalledWith('valid-api-key');
      expect(response.status).toBe(200);
    });

    test('GET /api/protected/user should return user data with valid API key', async () => {
      // Set up mock to return valid user data
      validateApiKey.mockResolvedValue({
        userId: 'user123',
        name: 'Test User',
        email: 'test@example.com'
      });
      
      const response = await request(app)
        .get('/api/protected/user')
        .set('X-API-Key', 'valid-api-key');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('userId', 'user123');
      expect(response.body.data).toHaveProperty('email', 'test@example.com');
    });

    test('POST /api/protected/data should process data with valid API key', async () => {
      // Set up mock to return valid user data
      validateApiKey.mockResolvedValue({
        userId: 'user123',
        name: 'Test User'
      });
      
      const testData = { foo: 'bar' };
      
      const response = await request(app)
        .post('/api/protected/data')
        .set('X-API-Key', 'valid-api-key')
        .send({ data: testData });
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('processedBy', 'user123');
      expect(response.body.data.result).toContain(JSON.stringify(testData));
    });

    test('POST /api/protected/data should return 400 if data is missing', async () => {
      // Set up mock to return valid user data
      validateApiKey.mockResolvedValue({
        userId: 'user123',
        name: 'Test User'
      });
      
      const response = await request(app)
        .post('/api/protected/data')
        .set('X-API-Key', 'valid-api-key')
        .send({});
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Data is required');
    });
  });
}); 