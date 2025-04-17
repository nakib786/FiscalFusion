const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
// Remove the dependency on the non-existent models module
// const db = require('../models'); // Import your database models

// This would be replaced with your database models
// For example: const { ApiKey } = require('../models');
// For this example, we'll use a mock database
const mockApiKeysDB = [];

/**
 * Generate a secure API key for a user
 * @param {string} userId - The user ID
 * @param {string} name - Name/description of the API key
 * @param {number} expiresIn - Expiration in days (default: 30)
 * @returns {Object} The generated API key object
 */
const generateApiKey = async (userId, name = 'Default API Key', expiresIn = 30) => {
  // Generate a random string for the API key
  const apiKeyString = crypto.randomBytes(32).toString('hex');
  
  // Calculate expiration date
  const createdAt = new Date();
  const expiresAt = new Date(createdAt);
  expiresAt.setDate(expiresAt.getDate() + expiresIn);
  
  // Create the API key object
  const apiKey = {
    id: uuidv4(),
    userId,
    name,
    key: apiKeyString,
    createdAt,
    expiresAt,
    isActive: true
  };
  
  // In a real app, you would save this to your database
  // await ApiKey.create(apiKey);
  mockApiKeysDB.push(apiKey);
  
  return {
    id: apiKey.id,
    name: apiKey.name,
    key: apiKey.key,
    createdAt: apiKey.createdAt,
    expiresAt: apiKey.expiresAt
  };
};

/**
 * Validate an API key
 * @param {string} apiKeyString - The API key to validate
 * @returns {Object|null} User info if valid, null if invalid
 */
const validateApiKey = async (apiKeyString) => {
  if (!apiKeyString) return null;
  
  // In a real app, you would query your database
  // const apiKey = await ApiKey.findOne({ 
  //   where: { key: apiKeyString, isActive: true } 
  // });
  
  const apiKey = mockApiKeysDB.find(
    key => key.key === apiKeyString && key.isActive
  );
  
  if (!apiKey) return null;
  
  // Check if expired
  if (new Date() > new Date(apiKey.expiresAt)) {
    // Mark as inactive
    apiKey.isActive = false;
    // In a real app: await apiKey.save();
    return null;
  }
  
  // Return user info
  // In a real app, you would fetch user details from your user model
  return {
    userId: apiKey.userId,
    apiKeyId: apiKey.id
  };
};

/**
 * Get all API keys for a user
 * @param {string} userId - The user ID
 * @returns {Array} List of API keys
 */
const getUserApiKeys = async (userId) => {
  // In a real app: 
  // const keys = await ApiKey.findAll({ where: { userId } });
  
  const keys = mockApiKeysDB
    .filter(key => key.userId === userId)
    .map(key => ({
      id: key.id,
      name: key.name,
      createdAt: key.createdAt,
      expiresAt: key.expiresAt,
      isActive: key.isActive
    }));
    
  return keys;
};

/**
 * Revoke an API key
 * @param {string} keyId - The API key ID
 * @returns {boolean} Success status
 */
const revokeApiKey = async (keyId) => {
  // In a real app:
  // const apiKey = await ApiKey.findByPk(keyId);
  // if (!apiKey) throw new Error('API key not found');
  // apiKey.isActive = false;
  // await apiKey.save();
  
  const keyIndex = mockApiKeysDB.findIndex(key => key.id === keyId);
  
  if (keyIndex === -1) {
    throw new Error('API key not found');
  }
  
  mockApiKeysDB[keyIndex].isActive = false;
  
  return true;
};

module.exports = {
  generateApiKey,
  validateApiKey,
  getUserApiKeys,
  revokeApiKey
}; 