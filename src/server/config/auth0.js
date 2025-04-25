/**
 * Auth0 Configuration
 */
const dotenv = require('dotenv');

dotenv.config();

// Auth0 configuration
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET || 'a_long_random_string',
  baseURL: process.env.BASE_URL || 'http://localhost:8080',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,
  routes: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    callback: '/api/auth/callback'
  }
};

module.exports = config; 